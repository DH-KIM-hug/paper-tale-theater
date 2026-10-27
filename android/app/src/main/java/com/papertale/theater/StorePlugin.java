package com.papertale.theater;

import android.app.Activity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Google Play 결제(비소모성 "전체 구매"). iOS StorePlugin 과 같은 JS 인터페이스.
 * getPrice / isOwned / purchase / restore — 결과: { owned, productId, purchaseToken, acknowledged, reason? }
 * 앱은 acknowledge 하지 않는다. 서버(POST /v1/receipt/google)가 검증 뒤 acknowledge 한다.
 * 구매 후 3일 안에 acknowledge 되지 않으면 Google 이 자동 환불하므로, 서버 전송 실패 시
 * isOwned()/restore() 가 acknowledged=false 인 토큰을 계속 알려 주어 다음 실행에서 재전송한다.
 */
@CapacitorPlugin(name = "Store")
public class StorePlugin extends Plugin implements PurchasesUpdatedListener {
    static final String PRODUCT_ID = "com.papertale.theater.unlockall";

    private BillingClient client;
    @Nullable private PluginCall purchaseCall;

    @Override
    public void load() {
        client = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .build();
    }

    @Override
    protected void handleOnDestroy() {
        if (client != null) client.endConnection();
    }

    /** 연결 보장 후 실행. 연결 실패하면 onFail. */
    private void withClient(Runnable ok, Runnable fail) {
        if (client.isReady()) { ok.run(); return; }
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(@NonNull BillingResult r) {
                if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) ok.run(); else fail.run();
            }
            @Override public void onBillingServiceDisconnected() { /* 다음 호출 때 다시 연결 */ }
        });
    }

    private static JSObject result(boolean owned, @Nullable Purchase p, @Nullable String reason) {
        JSObject o = new JSObject();
        o.put("owned", owned);
        o.put("productId", PRODUCT_ID);
        if (p != null && owned) {
            o.put("purchaseToken", p.getPurchaseToken());
            o.put("acknowledged", p.isAcknowledged());
        }
        if (reason != null) o.put("reason", reason);
        return o;
    }

    /** 이 상품의 구매 완료(PURCHASED) 항목을 찾는다. */
    @Nullable
    private static Purchase findOwned(@Nullable List<Purchase> list) {
        if (list == null) return null;
        for (Purchase p : list) {
            if (p.getProducts().contains(PRODUCT_ID) && p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) return p;
        }
        return null;
    }

    private void queryOwned(PluginCall call) {
        withClient(() -> client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (r, list) -> {
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) { call.resolve(result(false, null, "error")); return; }
                Purchase p = findOwned(list);
                call.resolve(result(p != null, p, null));
            }), () -> call.resolve(result(false, null, "unavailable")));
    }

    @PluginMethod
    public void getPrice(PluginCall call) {
        withClient(() -> {
            QueryProductDetailsParams.Product prod = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_ID).setProductType(BillingClient.ProductType.INAPP).build();
            client.queryProductDetailsAsync(
                QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(prod)).build(),
                (r, res) -> {
                    JSObject o = new JSObject();
                    List<ProductDetails> list = res.getProductDetailsList();
                    if (r.getResponseCode() == BillingClient.BillingResponseCode.OK && !list.isEmpty()
                        && list.get(0).getOneTimePurchaseOfferDetails() != null) {
                        o.put("price", list.get(0).getOneTimePurchaseOfferDetails().getFormattedPrice());
                    }
                    call.resolve(o);
                });
        }, () -> call.resolve(new JSObject()));
    }

    @PluginMethod
    public void isOwned(PluginCall call) { queryOwned(call); }

    @PluginMethod
    public void restore(PluginCall call) { queryOwned(call); }

    @PluginMethod
    public void purchase(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) { call.resolve(result(false, null, "error")); return; }
        withClient(() -> {
            QueryProductDetailsParams.Product prod = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_ID).setProductType(BillingClient.ProductType.INAPP).build();
            client.queryProductDetailsAsync(
                QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(prod)).build(),
                (r, res) -> {
                    List<ProductDetails> list = res.getProductDetailsList();
                    if (r.getResponseCode() != BillingClient.BillingResponseCode.OK || list.isEmpty()) {
                        call.resolve(result(false, null, "no-product")); return;
                    }
                    List<BillingFlowParams.ProductDetailsParams> pd = new ArrayList<>();
                    pd.add(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(list.get(0)).build());
                    purchaseCall = call;
                    // 결제창은 UI 스레드에서 연다
                    activity.runOnUiThread(() -> {
                        BillingResult lr = client.launchBillingFlow(activity,
                            BillingFlowParams.newBuilder().setProductDetailsParamsList(pd).build());
                        if (lr.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                            PluginCall c = purchaseCall; purchaseCall = null;
                            if (c != null) c.resolve(result(false, null, "error"));
                        }
                    });
                });
        }, () -> call.resolve(result(false, null, "unavailable")));
    }

    /** 결제창 결과 또는 앱 밖(다른 기기·프로모션)에서 생긴 구매 갱신 */
    @Override
    public void onPurchasesUpdated(@NonNull BillingResult r, @Nullable List<Purchase> list) {
        PluginCall c = purchaseCall; purchaseCall = null;
        int code = r.getResponseCode();
        Purchase owned = (code == BillingClient.BillingResponseCode.OK) ? findOwned(list) : null;
        if (c != null) {
            if (owned != null) c.resolve(result(true, owned, null));
            else if (code == BillingClient.BillingResponseCode.USER_CANCELED) c.resolve(result(false, null, "cancelled"));
            else if (code == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) queryOwned(c);
            else if (code == BillingClient.BillingResponseCode.OK && list != null && !list.isEmpty()) c.resolve(result(false, null, "pending"));
            else c.resolve(result(false, null, "error"));
        } else if (owned != null) {
            notifyListeners("ownedChanged", result(true, owned, null));
        }
    }
}

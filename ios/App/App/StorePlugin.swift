import Foundation
import Capacitor
import StoreKit

let unlockAllProductID = "com.papertale.theater.unlockall"
/// 이름 바꾸기 이용권 0.99달러(소모성). 4.99(unlockall) 산 사람만 산다 — 화면이 버튼을 숨기고 서버도 다시 확인한다 (docs/NAME_CHANGE_PLAN.md)
let renameProductID = "com.papertale.theater.rename"

@objc(StorePlugin)
public class StorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StorePlugin"
    public let jsName = "Store"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getPrice", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isOwned", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSignedTransaction", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getRenamePrice", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchaseRename", returnType: CAPPluginReturnPromise)
    ]

    private var updates: Task<Void, Never>?

    public override func load() {
        updates = Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let tx) = result {
                    await tx.finish()
                    // 소모성 이용권은 구매 복원이 안 되므로, 결제 화면 밖에서 끝난 거래(승인 대기 뒤 등)도 영수증을 앱에 넘겨 서버로 보낸다
                    if tx.productID == renameProductID {
                        self?.notifyListeners("renamePurchased", data: ["signedTransaction": result.jwsRepresentation])
                        continue
                    }
                }
                // 영수증(JWS)도 함께 보내 앱이 서버에 올릴 수 있게(가족 공유·다른 기기에서 산 구매·환불 반영)
                self?.notifyListeners("ownedChanged", data: await Self.ownedResult())
            }
        }
    }

    deinit { updates?.cancel() }

    static func ownsUnlockAll() async -> Bool {
        for await result in Transaction.currentEntitlements {
            if case .verified(let tx) = result, tx.productID == unlockAllProductID, tx.revocationDate == nil { return true }
        }
        return false
    }

    /// 현재 소유 중인 거래의 JWS (서버 영수증 검증용). 없으면 nil.
    static func currentSignedTransaction() async -> String? {
        for await result in Transaction.currentEntitlements {
            if case .verified(let tx) = result, tx.productID == unlockAllProductID, tx.revocationDate == nil {
                return result.jwsRepresentation
            }
        }
        return nil
    }

    /// owned 결과에 signedTransaction 을 붙여 돌려준다 (소유 중일 때만).
    static func ownedResult(extra: [String: Any] = [:]) async -> [String: Any] {
        var out = extra
        if let jws = await currentSignedTransaction() {
            out["owned"] = true
            out["signedTransaction"] = jws
        } else {
            out["owned"] = false
        }
        return out
    }

    @objc func getSignedTransaction(_ call: CAPPluginCall) {
        Task {
            if let jws = await Self.currentSignedTransaction() {
                call.resolve(["owned": true, "signedTransaction": jws])
            } else { call.resolve(["owned": false]) }
        }
    }

    @objc func getPrice(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: [unlockAllProductID])
                if let p = products.first { call.resolve(["price": p.displayPrice]) } else { call.resolve([:]) }
            } catch { call.resolve([:]) }
        }
    }

    @objc func isOwned(_ call: CAPPluginCall) {
        Task { call.resolve(await Self.ownedResult()) }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [unlockAllProductID]).first else {
                    call.resolve(["owned": false, "reason": "no-product"]); return
                }
                switch try await product.purchase() {
                case .success(let verification):
                    if case .verified(let tx) = verification {
                        await tx.finish()
                        call.resolve(["owned": true, "signedTransaction": verification.jwsRepresentation])
                    } else { call.resolve(["owned": false, "reason": "unverified"]) }
                case .userCancelled: call.resolve(["owned": false, "reason": "cancelled"])
                case .pending: call.resolve(["owned": false, "reason": "pending"])
                @unknown default: call.resolve(["owned": false])
                }
            } catch { call.resolve(["owned": false, "reason": "error"]) }
        }
    }

    @objc func getRenamePrice(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: [renameProductID])
                if let p = products.first { call.resolve(["price": p.displayPrice]) } else { call.resolve([:]) }
            } catch { call.resolve([:]) }
        }
    }

    /// 이름 바꾸기 이용권(소모성) 구매. 성공하면 거래 JWS 를 돌려주고, 앱이 서버(/v1/receipt/apple)로 보낸다. 서버가 거래 ID 를 한 번만 쓴다
    @objc func purchaseRename(_ call: CAPPluginCall) {
        Task {
            do {
                guard await Self.ownsUnlockAll() else { call.resolve(["purchased": false, "reason": "not_owned"]); return }
                guard let product = try await Product.products(for: [renameProductID]).first else {
                    call.resolve(["purchased": false, "reason": "no-product"]); return
                }
                switch try await product.purchase() {
                case .success(let verification):
                    if case .verified(let tx) = verification {
                        await tx.finish()
                        call.resolve(["purchased": true, "signedTransaction": verification.jwsRepresentation])
                    } else { call.resolve(["purchased": false, "reason": "unverified"]) }
                case .userCancelled: call.resolve(["purchased": false, "reason": "cancelled"])
                case .pending: call.resolve(["purchased": false, "reason": "pending"])
                @unknown default: call.resolve(["purchased": false])
                }
            } catch { call.resolve(["purchased": false, "reason": "error"]) }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            try? await AppStore.sync()
            call.resolve(await Self.ownedResult())
        }
    }
}

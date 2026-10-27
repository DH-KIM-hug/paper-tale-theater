package com.papertale.theater;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 결제 플러그인(JS 이름 "Store")은 super.onCreate 전에 등록해야 한다
        registerPlugin(StorePlugin.class);
        super.onCreate(savedInstanceState);
    }
}

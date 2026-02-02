package com.dclnhs.science7;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Nothing else needed. Quasar's q-safe-area handles safe areas.
        // Status bar is visible, navbar hidden naturally, content below notch.
    }
}

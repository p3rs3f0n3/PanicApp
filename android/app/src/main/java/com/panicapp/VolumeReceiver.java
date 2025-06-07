package com.panicapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.util.Log;
import android.widget.Toast;

public class VolumeReceiver extends BroadcastReceiver {
    private static long lastPressTime = 0;
    private static int pressCount = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals("android.media.VOLUME_CHANGED_ACTION")) {
            long now = System.currentTimeMillis();

            if (now - lastPressTime < 500) { // dentro de 500ms
                pressCount++;
                if (pressCount == 2) {
                    Log.d("VolumeReceiver", "Doble toque detectado 🚨");
                    Toast.makeText(context, "¡Doble toque detectado!", Toast.LENGTH_LONG).show();

                    Intent i = new Intent(context, AlertService.class);
                    context.startService(i);
                    
                    pressCount = 0;
                }
            } else {
                pressCount = 1;
            }
            lastPressTime = now;
        }
    }
}

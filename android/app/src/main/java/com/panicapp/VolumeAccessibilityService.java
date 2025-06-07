package com.panicapp;

import android.accessibilityservice.AccessibilityService;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Toast;

public class VolumeAccessibilityService extends AccessibilityService {

    private long lastVolumePressTime = 0;
    private int volumePressCount = 0;

    @Override
    protected boolean onKeyEvent(KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN &&
            (event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_UP || event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_DOWN)) {

            long currentTime = System.currentTimeMillis();

            if (currentTime - lastVolumePressTime < 500) {
                volumePressCount++;
                if (volumePressCount == 2) {
                    Toast.makeText(this, "Doble toque detectado 🚨", Toast.LENGTH_SHORT).show();
                    volumePressCount = 0;
                }
            } else {
                volumePressCount = 1;
            }

            lastVolumePressTime = currentTime;
        }
        return super.onKeyEvent(event);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Obligatorio aunque no lo uses
    }

    @Override
    public void onInterrupt() {
    }

    @Override
    public void onServiceConnected() {
        Toast.makeText(this, "Servicio de accesibilidad activado", Toast.LENGTH_SHORT).show();
    }
}

package com.panicapp;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.widget.Toast;

public class AlertService extends Service {
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(this, "🚨 Alerta activada por doble volumen", Toast.LENGTH_LONG).show();

        // Aquí podrías enviar ubicación, mensaje, etc.
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

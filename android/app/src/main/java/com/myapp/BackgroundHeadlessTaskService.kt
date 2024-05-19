package com.myapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class BackgroundHeadlessTaskService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notification = NotificationCompat.Builder(applicationContext, "demo")
                .setContentTitle("Headless Work")
                .setTicker("runn")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true)
                .build()
            startForeground(1, notification)
        }
        Log.d("TestHeadless", "i am here")
        val extras = intent.extras
        if (extras != null) {
            return HeadlessJsTaskConfig(
                "BackgroundHeadlessTask",
                Arguments.fromBundle(extras),
                5000,
                true
            )
        }
        return null
    }
}

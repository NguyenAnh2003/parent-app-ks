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
import androidx.work.Worker
import androidx.work.WorkerParameters

class BackgroundWorker(context: Context, workerParams: WorkerParameters) :
    Worker(context, workerParams) {

    override fun doWork(): Result {
        Log.d("BackgroundWorker", "Worker started executing.")
        val extras = Bundle()
        val service = Intent(applicationContext, BackgroundHeadlessTaskService::class.java)
        service.putExtras(extras)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createChannel()
            applicationContext.startForegroundService(service)
            Log.d("BackgroundWorker", "start services foreground.")
            showNotification("Foreground Service", "Background task is running")
        } else {
            Log.d("BackgroundWorker", "start services.")
            applicationContext.startService(service)
        }
        return Result.success()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun createChannel() {
        try {
            val channelId = "demo"
            val channelName = "Test Channel"
            val description = "This is a test channel"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, channelName, importance)
            channel.description = description

            val notificationManager =
                applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        } catch (e: Exception) {
            Log.e("BackgroundWorker", "Error creating notification channel: ${e.message}")
        }
    }
    private fun showNotification(title: String, message: String) {
        val channelId = "demo" // Change this to your channel ID
        val notificationBuilder = NotificationCompat.Builder(applicationContext, channelId)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)

        val notificationManager =
            applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, notificationBuilder.build()) // Notification ID can be any unique integer
    }

}

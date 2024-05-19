package com.myapp

import android.content.Context
import android.util.Log
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequest
import androidx.work.WorkManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.TimeUnit

class BackgroundModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val mContext: Context = reactContext
    private val workRequest: PeriodicWorkRequest = PeriodicWorkRequest.Builder(
        BackgroundWorker::class.java, 20, TimeUnit.MINUTES
    ).build()

    @ReactMethod
    fun startBackgroundWork() {
            WorkManager.getInstance(mContext).enqueueUniquePeriodicWork(
                "testWork", ExistingPeriodicWorkPolicy.KEEP, workRequest
            )
        Log.d("start", "test")
    }

    @ReactMethod
    fun stopBackgroundWork() {
        WorkManager.getInstance(mContext).cancelUniqueWork("testWork")
    }
    
    override fun getName(): String {
        return "BackgroundManager";
    }
}

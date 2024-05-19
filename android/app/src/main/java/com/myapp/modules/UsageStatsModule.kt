package com.myapp

/** needed package */
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise // promise interface
import com.facebook.react.bridge.Callback // call back interface

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.common.MapBuilder

/** usage stats package */
import android.app.usage.UsageEvents
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.app.AppOpsManager

/** */
import android.content.Context // android content
import android.util.Log
import java.lang.Exception

/** time package */
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.HashMap
import java.util.List;


class UsageStatsModule(reactApplicationContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactApplicationContext) {

    /** class log tag */
    val TAG: String = UsageStatsModule::class.toString()

    override fun getName(): String {
        /** @return module name */
        return "UsageStats"
    }

    override fun getConstants(): Map<String, Any> {
        /** constants return (daily, weekly, monthly, yearly)
         * [0: daily, 1: weekly, 2: monthly, 3: yearly] */
        val constants: MutableMap<String, Any> = MapBuilder.newHashMap()
        constants.put("INTERVAL_BEST", UsageStatsManager.INTERVAL_BEST)
        constants.put("INTERVAL_DAILY", UsageStatsManager.INTERVAL_DAILY)
        constants.put("INTERVAL_WEEKLY", UsageStatsManager.INTERVAL_WEEKLY)
        constants.put("INTERVAL_MONTHLY", UsageStatsManager.INTERVAL_MONTHLY)
        constants.put("INTERVAL_YEARLY", UsageStatsManager.INTERVAL_YEARLY)

        return constants
    }

    /** test function */
    @ReactMethod
    fun testUsage(promise: Promise) {
        /** @sample */
        val stats = "haha-test native module"
        // testing
        promise.resolve(stats)
    }

    /** get current usage data through events */
    @ReactMethod
    fun getEventUsageData(startTime: Double, endTime: Double, promise: Promise) {
        try {
            /**
             * @param startTime - the time when user move to background state
             * @param endTime - the time user move to active state
             * @return list of usage data of every single app
             * */
            val usageStatsManager: UsageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val uEvents: UsageEvents = usageStatsManager.queryEvents(startTime.toLong(), endTime.toLong()) //

            while (uEvents.hasNextEvent()) {
                val e : UsageEvents.Event = UsageEvents.Event() //
                uEvents.getNextEvent(e) //
                if(e != null) {
                    Log.d("UsageEvent", "package name - ${e.getPackageName()} timestamp: ${e.getTimeStamp()}")
                }
            }

        } catch (e: java.lang.Exception) {
            promise.reject("SOME THING WRONG WHEN GET CURRENT USAGE DATA", e.message)
        }
    }

    /** check usage data access permission */
    @ReactMethod
    fun checkUsageDataAccess(promise: Promise) {
        /** @return access granted? if not react-native will move to Usage Data Access
         * to allow the app */
        try {
            val appOpsManager = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = appOpsManager.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                reactApplicationContext.packageName
            )
            Log.d("CheckUsagePermission", "${mode}")
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } catch (e: java.lang.Exception) {
            promise.reject("CHECK_ACCESS_ERROR", e.message)
        }
    }

    /** get usage list function */
    @ReactMethod
    fun getUsagesList(interval: Int, startTime: Double, endTime: Double, promise: Promise) {
        /**
         * @param interval - (daily, week, month, year)
         * @param startTime - the time when user move to background state
         * @param endTime - the time user move to active state
         * @return list of HISTORICAL usage data of every single app
         * */
        try {
            /**  */
            // val calendar = java.util.Calendar()//

            /**  */
            if(isUsageStatsPermissionGranted(reactApplicationContext)) {
                val result = WritableNativeMap()

                // init usage stats manager
                val usageStatsManager: UsageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

                // Log.d("UsageStatsModule", "UsageStats: manager - ${usageStatsManager}")

                /** queryUsageStats (interval, startTime, endTime) */
                val usageStatsList: MutableList<UsageStats> = usageStatsManager.queryUsageStats(getUsageInterval(interval), startTime.toLong(), endTime.toLong())

                // Log.d("UsageStatsModule", "UsageStats: query usage - ${usageStatsList}")

                for (us in usageStatsList) {
                    /**  */
                    val usageStats = WritableNativeMap()

                    /**  */
                    usageStats.putString("packageName", us.getPackageName())
                    usageStats.putDouble("totalTimeInForeground", us.getTotalTimeInForeground().toDouble())
                    usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp().toDouble())
                    usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp().toDouble())
                    usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed().toDouble())
                    // usageStats.putInt("describeContents", us.describeContents())

                    Log.d("UsageStatsModule", "UsageStats: App packge and usage - package name: ${us.packageName} " +
                            "tottal time in foreground: ${us.totalTimeInForeground.toDouble()} " +
                            "first timestamp: ${us.firstTimeStamp.toDouble()} " +
                            "last timestamp: ${us.lastTimeStamp.toDouble()} " +
                            "last time used: ${us.lastTimeUsed.toDouble()}")

                    /**  */
                    result.putMap(us.packageName, usageStats)
                }

                /** log result - adb logcat -s UsageStatsModule */
                // Log.d("UsageStatsModule", "UsageStats: Entire Map - ${result}")

                promise.resolve(result) //
            } else {
                promise.reject("PERMISSION_DENIED", "Usage stats permission is not granted.")
            }

        } catch (e: java.lang.Exception) {
            /** log exception */
            // logger
            Log.e("UsageStatsModule", "Error querying usage stats", e)

            println("Exception usage module: ${e}") // just print
            // Promise reject error
            promise.reject("Error:", e) //
        }
    }

    private fun getUsageInterval(interval: Int): Int {
        /** 
        * @param: interval
        * @return: interval converted
        */
        var result: Int = 0
        when (interval) {
            0 -> result = UsageStatsManager.INTERVAL_BEST
            1 -> result = UsageStatsManager.INTERVAL_DAILY
            2 -> result = UsageStatsManager.INTERVAL_WEEKLY
            3 -> result = UsageStatsManager.INTERVAL_MONTHLY
            4 -> result = UsageStatsManager.INTERVAL_YEARLY
        }

        /**  */
        return result
    }

    private fun isUsageStatsPermissionGranted(context: Context): Boolean {
        val appOpsManager = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOpsManager.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }
    
}

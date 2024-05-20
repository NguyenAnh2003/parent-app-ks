package com.myapp

/** needed package */
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise // promise interface
import com.facebook.react.bridge.Callback // call back interface
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.common.MapBuilder

/** */
import android.content.Context // android content
import android.util.Log
import java.lang.Exception
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Bitmap.CompressFormat
import android.graphics.BitmapFactory
import android.util.Base64
import android.graphics.drawable.BitmapDrawable
import java.io.ByteArrayOutputStream
import android.graphics.drawable.Drawable

/** time package */
import java.text.SimpleDateFormat
import java.util.ArrayList
import java.util.Calendar
import java.util.HashMap
import java.util.List;


class AppPackageModule(reactApplicationContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactApplicationContext) {

    override fun getName(): String {
        /** @return module name */
        return "AppPackaging"
    }

    /** preprocessing app package icon */
    private fun preprocessAppIcon(appPackage: WritableNativeMap, context: Context): String {
        try {
            var result: String = ""
            /** process icon */
            Log.d("hahah", "${appPackage.getString("packageName").toString()}")
            val drawable: BitmapDrawable = context.getPackageManager().getApplicationIcon(appPackage.getString("packageName").toString()) as BitmapDrawable
            if(drawable != null) {
                val bitmap = drawable.bitmap
                val outputStream = ByteArrayOutputStream()
                bitmap.compress(CompressFormat.PNG, 100, outputStream)
                val imageBytes = outputStream.toByteArray()
                result = Base64.encodeToString(imageBytes, Base64.DEFAULT)
            } else {
                Log.d("shit", "shitttt") 
            }
            return result
        } catch (e: java.lang.Exception) {
            throw java.lang.Exception("${e.message}")
        }
    }

    /** test function */
    @ReactMethod
    fun preprocessAppPackageInfo(appPackages: ReadableArray,
                                 promise: Promise) {
        try {
            val processedPackages = WritableNativeArray()

            for(i in 0 until appPackages.size()) {
                /** temp var */
                val packageMap = WritableNativeMap()
                val packageInfo = appPackages.getMap(i)

                packageMap.putString("id", packageInfo.getString("id"))
                packageMap.putString("name", packageInfo.getString("appName"))
                packageMap.putString("packageName", packageInfo.getString("packageName"))

                /** base64 icon */
                var iconBas64: String = preprocessAppIcon(packageMap, reactApplicationContext) //
                packageMap.putString("icon", iconBas64)

                packageMap.putInt("timeUsed", packageInfo.getInt("timeUsed"))
                packageMap.putString("dateUsed", packageInfo.getString("dateUsed"))


                /** put result */
                processedPackages.pushMap(packageMap)
            }

            /** return result */
            promise.resolve(processedPackages)
        } catch (e: java.lang.Exception) {
            promise.reject("${e.message}")
        }
    }

}

package com.myapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.uimanager.ReactShadowNode
import android.view.View

class AppModulesPackage : ReactPackage {
    
    /** register module */
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    override fun createNativeModules(reactContext: ReactApplicationContext):
        MutableList<NativeModule> = listOf(UsageStatsModule(reactContext),
        AppPackageModule(reactContext),BackgroundModule(reactContext)).toMutableList()
}

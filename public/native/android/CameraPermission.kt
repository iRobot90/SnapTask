// @Fleetbo ModuleName: CameraPermission
package com.fleetbo.modules

import android.Manifest
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CameraPermission(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CameraPermission"
    }

    @ReactMethod
    fun check(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        val status = ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA)
        promise.resolve(status == PackageManager.PERMISSION_GRANTED)
    }

    @ReactMethod
    fun request(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(true)
            return
        }

        // Request permission - this triggers system dialog
        ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.CAMERA), 1001)
        
        // Return false to let the UI know permission is being requested
        // The user will grant/deny in the system dialog
        promise.resolve(false)
    }

    @ReactMethod
    fun isGranted(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        val status = ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA)
        promise.resolve(status == PackageManager.PERMISSION_GRANTED)
    }
}

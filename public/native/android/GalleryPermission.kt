// @Fleetbo ModuleName: GalleryPermission
package com.fleetbo.modules

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class GalleryPermission(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "GalleryPermission"
    }

    private fun getPermission(): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_IMAGES
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }
    }

    @ReactMethod
    fun check(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        val status = ContextCompat.checkSelfPermission(activity, getPermission())
        promise.resolve(status == PackageManager.PERMISSION_GRANTED)
    }

    @ReactMethod
    fun request(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        if (ContextCompat.checkSelfPermission(activity, getPermission()) == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(true)
            return
        }

        // Request permission - this triggers system dialog
        ActivityCompat.requestPermissions(activity, arrayOf(getPermission()), 1002)
        
        // Return false to let the UI know permission is being requested
        promise.resolve(false)
    }

    @ReactMethod
    fun isGranted(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        val status = ContextCompat.checkSelfPermission(activity, getPermission())
        promise.resolve(status == PackageManager.PERMISSION_GRANTED)
    }
}

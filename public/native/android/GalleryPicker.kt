// @Fleetbo Deploy
// @Fleetbo ModuleName: GalleryPicker
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

package com.fleetbo.user.modules

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.fleetbo.sdk.FleetboModule

class GalleryPicker(context: android.content.Context, communicator: Any) : FleetboModule(context, communicator) {

    private var pendingCallbackId: String? = null

    fun pick(callbackId: String, params: String) {
        pendingCallbackId = callbackId
        
        // Check permission first
        if (!hasGalleryPermission()) {
            // Request permission
            requestGalleryPermission()
            return
        }
        
        // Open gallery
        openGallery()
    }

    private fun hasGalleryPermission(): Boolean {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_IMAGES
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }
        return ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestGalleryPermission() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_IMAGES
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }
        
        val activity = getCurrentActivity()
        if (activity != null) {
            ActivityCompat.requestPermissions(activity, arrayOf(permission), 1002)
        }
        
        // Try to open anyway - system will handle permission
        runOnUi {
            openGallery()
        }
    }

    private fun openGallery() {
        runOnUi {
            try {
                val intent = Intent(Intent.ACTION_PICK)
                intent.type = "image/*"
                intent.putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/jpeg", "image/png", "image/gif"))
                
                val activity = getCurrentActivity()
                if (activity != null) {
                    activity.startActivityForResult(intent, 1003)
                } else {
                    sendError(pendingCallbackId ?: "", "No activity available")
                }
            } catch (e: Exception) {
                sendError(pendingCallbackId ?: "", "Failed to open gallery: ${e.message}")
            }
        }
    }

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == 1003 && data != null) {
            val uri = data.data
            if (uri != null) {
                // Copy to app's cache for persistent access
                try {
                    val inputStream = context.contentResolver.openInputStream(uri)
                    val file = java.io.File(context.cacheDir, "gallery_${System.currentTimeMillis()}.jpg")
                    inputStream?.use { input ->
                        file.outputStream().use { output ->
                            input.copyTo(output)
                        }
                    }
                    val response = "{\"url\": \"file://${file.absolutePath}\", \"uri\": \"$uri\"}"
                    sendSuccess(pendingCallbackId ?: "", response)
                } catch (e: Exception) {
                    val response = "{\"url\": \"$uri\", \"uri\": \"$uri\"}"
                    sendSuccess(pendingCallbackId ?: "", response)
                }
            } else {
                sendError(pendingCallbackId ?: "", "No image selected")
            }
        }
        pendingCallbackId = null
    }
}

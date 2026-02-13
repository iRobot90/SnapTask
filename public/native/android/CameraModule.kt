// @Fleetbo Deploy
// @Fleetbo ModuleName: CameraModule
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.CAMERA" />
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

package com.fleetbo.user.modules

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.MediaStore
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.fleetbo.sdk.FleetboModule
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class CameraModule(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    
    private var currentPhotoPath: String = ""
    private var pendingCallbackId: String? = null
    
    fun requestPermissionAndCapture(callbackId: String, params: String) {
        val activity = getCurrentActivity()
        if (activity == null) {
            sendError(callbackId, "No activity available")
            emitEvent("CAMERA_CAPTURE_ERROR", mapOf("error" to "No activity"))
            return
        }
        
        val hasPermission = ContextCompat.checkSelfPermission(
            activity,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
        
        if (hasPermission) {
            launchCamera(callbackId)
        } else {
            pendingCallbackId = callbackId
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.CAMERA),
                REQUEST_CAMERA_PERMISSION
            )
        }
    }
    
    fun checkPermission(callbackId: String, params: String) {
        val activity = getCurrentActivity()
        if (activity == null) {
            sendError(callbackId, "No activity available")
            return
        }
        
        val hasPermission = ContextCompat.checkSelfPermission(
            activity,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
        
        sendSuccess(callbackId, mapOf("hasPermission" to hasPermission))
    }
    
    fun launchCamera(callbackId: String, params: String = "") {
        val activity = getCurrentActivity()
        if (activity == null) {
            sendError(callbackId, "No activity available")
            emitEvent("CAMERA_CAPTURE_ERROR", mapOf("error" to "No activity"))
            return
        }
        
        try {
            val photoFile = createImageFile()
            val photoURI = FileProvider.getUriForFile(
                activity,
                "${activity.packageName}.fileprovider",
                photoFile
            )
            
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
            }
            
            pendingCallbackId = callbackId
            activity.startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)
            
        } catch (ex: Exception) {
            sendError(callbackId, "Failed to launch camera: ${ex.message}")
            emitEvent("CAMERA_CAPTURE_ERROR", mapOf("error" to ex.message))
        }
    }
    
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val storageDir = context.getExternalFilesDir(null) ?: context.filesDir
        return File.createTempFile(
            "JPEG_${timeStamp}_",
            ".jpg",
            storageDir
        ).apply {
            currentPhotoPath = absolutePath
        }
    }
    
    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_IMAGE_CAPTURE) {
            val callbackId = pendingCallbackId
            pendingCallbackId = null
            
            if (resultCode == Activity.RESULT_OK) {
                val file = File(currentPhotoPath)
                val response = mapOf(
                    "uri" to "file://$currentPhotoPath",
                    "fileName" to file.name,
                    "fileSize" to file.length(),
                    "timestamp" to System.currentTimeMillis()
                )
                
                emitEvent("CAMERA_CAPTURE_SUCCESS", response)
                
                if (callbackId != null) {
                    sendSuccess(callbackId, response)
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                emitEvent("CAMERA_CAPTURE_CANCELLED", mapOf("message" to "User cancelled"))
                
                if (callbackId != null) {
                    sendSuccess(callbackId, mapOf("cancelled" to true))
                }
            } else {
                emitEvent("CAMERA_CAPTURE_ERROR", mapOf("error" to "Capture failed"))
                
                if (callbackId != null) {
                    sendError(callbackId, "Capture failed")
                }
            }
        }
    }
    
    fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (requestCode == REQUEST_CAMERA_PERMISSION) {
            val callbackId = pendingCallbackId
            
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (callbackId != null) {
                    launchCamera(callbackId)
                }
            } else {
                emitEvent("CAMERA_PERMISSION_DENIED", mapOf("message" to "Permission denied"))
                
                if (callbackId != null) {
                    pendingCallbackId = null
                    sendError(callbackId, "Camera permission denied")
                }
            }
        }
    }
    
    companion object {
        const val REQUEST_CAMERA_PERMISSION = 1001
        const val REQUEST_IMAGE_CAPTURE = 1002
    }
}

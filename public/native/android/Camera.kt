// @Fleetbo ModuleName: Camera
package com.fleetbo.modules

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.ThumbnailUtils
import com.fleetbo.jsi.FleetboModule
import com.fleetbo.jsi.Promise
import com.fleetbo.jsi.JSObject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import kotlin.math.min

class Camera(context: Context) : FleetboModule(context) {

    private val moduleScope = CoroutineScope(Dispatchers.Main)

    // This is triggered by the native camera result.
    // For this example, we assume a file path is received.
    fun processImage(filePath: String) {
        moduleScope.launch {
            try {
                val result = processImageInBackground(filePath)
                val payload = JSObject()
                payload.putString("fullUri", result.first)
                payload.putString("thumbnailUri", result.second)
                emit("IMAGE_PROCESSED", payload)
            } catch (e: Exception) {
                // Emit an error event for the JS layer to handle
                val errorPayload = JSObject()
                errorPayload.putString("error", e.message ?: "Unknown processing error")
                emit("IMAGE_PROCESS_ERROR", errorPayload)
            }
        }
    }

    private suspend fun processImageInBackground(sourcePath: String): Pair<String, String> = 
        withContext(Dispatchers.IO) {
            val sourceFile = File(sourcePath)
            if (!sourceFile.exists()) throw Exception("Source file not found")

            val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            BitmapFactory.decodeFile(sourcePath, options)

            options.inSampleSize = calculateInSampleSize(options, 1920, 1080)
            options.inJustDecodeBounds = false
            val bitmap = BitmapFactory.decodeFile(sourcePath, options)

            val scaledBitmap = scaleToFit(bitmap, 1920, 1080)
            if (bitmap != scaledBitmap) bitmap.recycle()

            val thumbnail = ThumbnailUtils.extractThumbnail(scaledBitmap, 200, 200)

            val fullFile = saveBitmap(scaledBitmap, "full_")
            val thumbFile = saveBitmap(thumbnail, "thumb_")

            scaledBitmap.recycle()
            thumbnail.recycle()

            Pair(fullFile.toURI().toString(), thumbFile.toURI().toString())
        }

    private fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
        val (height: Int, width: Int) = options.run { outHeight to outWidth }
        var inSampleSize = 1
        if (height > reqHeight || width > reqWidth) {
            val halfHeight: Int = height / 2
            val halfWidth: Int = width / 2
            while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                inSampleSize *= 2
            }
        }
        return inSampleSize
    }

    private fun scaleToFit(bitmap: Bitmap, maxWidth: Int, maxHeight: Int): Bitmap {
        if (bitmap.width <= maxWidth && bitmap.height <= maxHeight) return bitmap
        val ratio = min(maxWidth.toDouble() / bitmap.width, maxHeight.toDouble() / bitmap.height)
        val newWidth = (bitmap.width * ratio).toInt()
        val newHeight = (bitmap.height * ratio).toInt()
        return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true)
    }

    private fun saveBitmap(bitmap: Bitmap, prefix: String): File {
        val outputDir = context.cacheDir
        val outputFile = File.createTempFile(prefix, ".jpg", outputDir)
        FileOutputStream(outputFile).use { out ->
            bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out)
        }
        return outputFile
    }

    @FleetboMethod
    fun capture(promise: Promise) {
        // Placeholder for launching camera intent via ActivityResultLauncher.
        // On result, the callback would invoke processImage("path/to/image.jpg").
        promise.resolve(true) // Acknowledge the call immediately.
    }
}
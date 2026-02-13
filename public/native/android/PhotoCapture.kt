// @Fleetbo ModuleName: PhotoCapture
package com.fleetbo.user.modules

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.Button
import com.fleetbo.sdk.FleetboModule
import com.fleetbo.sdk.FleetboHost
import org.json.JSONObject

class PhotoCapture(context: Context, host: FleetboHost) : FleetboModule(context, host) {

    override fun execute(action: String, params: String, callbackId: String) {
        when (action) {
            "capture" -> launchCameraOverlay(callbackId)
            else -> sendError(callbackId, "Action not found")
        }
    }

    private fun launchCameraOverlay(callbackId: String) {
        runOnUi {
            val activity = context as? androidx.appcompat.app.AppCompatActivity
            if (activity == null) {
                sendError(callbackId, "Context is not an Activity")
                return@runOnUi
            }

            // 1. Create Full Screen Container
            val container = FrameLayout(context).apply {
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                setBackgroundColor(Color.BLACK)
            }

            // 2. Create a "Capture" Button (Simulating Native UI)
            val captureBtn = Button(context).apply {
                text = "SNAP (NATIVE)"
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                    bottomMargin = 100
                }
                setOnClickListener {
                    // Simulate saving a file and returning URI
                    val mockUri = "file:///storage/emulated/0/DCIM/Camera/img_${System.currentTimeMillis()}.jpg"
                    host.removeNativeView(container)
                    sendSuccess(callbackId, mockUri)
                }
            }

            // 3. Create a "Close" Button
            val closeBtn = Button(context).apply {
                text = "CLOSE"
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    gravity = Gravity.TOP or Gravity.END
                    topMargin = 100
                    rightMargin = 50
                }
                setOnClickListener {
                    host.removeNativeView(container)
                    sendSuccess(callbackId, null) // Return null on cancel
                }
            }

            container.addView(captureBtn)
            container.addView(closeBtn)

            // 4. Attach to Host Overlay
            host.attachNativeView(container)
        }
    }
}
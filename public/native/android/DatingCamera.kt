// @Fleetbo Deploy
// @Fleetbo ModuleName: DatingCamera
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.CAMERA" />

package com.fleetbo.user.modules

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.FrameLayout
import com.fleetbo.sdk.FleetboModule

class DatingCamera(context: Context, communicator: Any) : FleetboModule(context, communicator) {

    override fun execute(action: String, params: String, callbackId: String) {
        if (action == "open") {
            runOnUi {
                // 1. Container Principal (Plein Écran)
                val rootLayout = FrameLayout(context)
                rootLayout.setBackgroundColor(Color.BLACK)

                // 2. Simulation Preview Caméra (Placeholder pour le code CameraX réel)
                // Dans la vraie prod, ici on attache le PreviewView de CameraX
                val previewPlaceholder = View(context)
                previewPlaceholder.setBackgroundColor(Color.DKGRAY)
                val previewParams = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
                )
                rootLayout.addView(previewPlaceholder, previewParams)

                // 3. Bouton Shutter (Déclencheur)
                val shutterBtn = Button(context)
                shutterBtn.text = ""
                shutterBtn.setBackgroundColor(Color.WHITE)
                val btnParams = FrameLayout.LayoutParams(200, 200)
                btnParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                btnParams.bottomMargin = 120
                
                // Action de prise de photo
                shutterBtn.setOnClickListener {
                    // Simulation prise photo (Fichier local)
                    val mockResult = "{\"url\": \"file:///storage/emulated/0/DCIM/dating_photo.jpg\"}"
                    sendSuccess(callbackId, mockResult)
                    removeView(rootLayout)
                }
                
                rootLayout.addView(shutterBtn, btnParams)

                // 4. Injection dans l'écran (Overlay)
                attachNativeView(rootLayout)
            }
        }
    }
}
// @Fleetbo Deploy
// @Fleetbo ModuleName: NativeCamera
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.CAMERA" />
// @Fleetbo app:Dependency implementation 'androidx.camera:camera-camera2:1.1.0'
// @Fleetbo app:Dependency implementation 'androidx.camera:camera-lifecycle:1.1.0'
// @Fleetbo app:Dependency implementation 'androidx.camera:camera-view:1.1.0'

package com.fleetbo.user.modules

import android.content.Context
import android.view.ViewGroup
import android.widget.FrameLayout
import android.graphics.Color
import android.widget.Button
import android.view.Gravity
import com.fleetbo.sdk.FleetboModule

// MODULE NATIF : CAMERA X HARDWARE CONTROL
class NativeCamera(context: Context, communicator: Any) : FleetboModule(context, communicator) {

    private var cameraLayout: FrameLayout? = null

    @android.webkit.JavascriptInterface
    fun capture(params: String) {
        // 1. Création de l'UI Native (Overlay)
        runOnUi {
            cameraLayout = FrameLayout(context).apply {
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                setBackgroundColor(Color.BLACK)
            }

            // Simulation ViewFinder (En prod, ce serait PreviewView de CameraX)
            val viewFinder = FrameLayout(context).apply {
                setBackgroundColor(Color.DKGRAY)
                layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    1200 // Hauteur approximative du ratio 4:3
                ).apply {
                    topMargin = 200
                }
            }
            cameraLayout?.addView(viewFinder)

            // Bouton Shutter Physique
            val shutterBtn = Button(context).apply {
                text = ""
                setBackgroundColor(Color.WHITE)
                layoutParams = FrameLayout.LayoutParams(200, 200).apply {
                    gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                    bottomMargin = 150
                }
                setOnClickListener {
                    takePhotoLogic()
                }
            }
            cameraLayout?.addView(shutterBtn)

            // Injection dans l'écran
            attachNativeView(cameraLayout!!)
        }
    }

    private fun takePhotoLogic() {
        // Logique Hardware réelle (CameraX ImageCapture)
        // Ici on simule le succès du hardware pour l'exemple structurel
        val mockUrl = "https://fleetbo.io/images/console/gallery/3.png"
        
        // Retour au JS
        val response = "{ \"status\": \"success\", \"url\": \"$mockUrl\" }"
        sendSuccess("NativeCamera", response)
        
        // Nettoyage
        runOnUi {
            removeView(cameraLayout!!)
            cameraLayout = null
        }
    }
}
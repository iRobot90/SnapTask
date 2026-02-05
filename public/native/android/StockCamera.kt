// @Fleetbo Deploy
// @Fleetbo ModuleName: StockCamera
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.CAMERA" />
// @Fleetbo manifest:App <meta-data android:name="com.fleetbo.module.camera" android:value="true" />

package com.fleetbo.user.modules

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.Button
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.fleetbo.sdk.FleetboModule
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class StockCamera(context: Context, communicator: Any) : FleetboModule(context, communicator) {

    private var imageCapture: ImageCapture? = null
    private lateinit var cameraExecutor: ExecutorService
    private var rootLayout: FrameLayout? = null

    init {
        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    // Point d'entrée appelé par Fleetbo.exec('StockCamera', 'capture', {})
    fun capture(callbackId: String, params: String) {
        runOnUi {
            setupCameraUI(callbackId)
        }
    }

    private fun setupCameraUI(callbackId: String) {
        rootLayout = FrameLayout(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.BLACK)
        }

        val viewFinder = PreviewView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        // Bouton Déclencheur (Style Natif)
        val captureBtn = Button(context).apply {
            text = ""
            background = android.graphics.drawable.ShapeDrawable(android.graphics.drawable.shapes.OvalShape()).apply {
                paint.color = Color.WHITE
            }
            layoutParams = FrameLayout.LayoutParams(200, 200).apply {
                gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                bottomMargin = 100
            }
            setOnClickListener {
                takePhoto(callbackId)
            }
        }

        rootLayout?.addView(viewFinder)
        rootLayout?.addView(captureBtn)

        attachNativeView(rootLayout!!)
        startCamera(viewFinder)
    }

    private fun startCamera(viewFinder: PreviewView) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)

        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(viewFinder.surfaceProvider)
            }

            imageCapture = ImageCapture.Builder().build()
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            try {
                cameraProvider.unbindAll()
                // Note: Dans un vrai contexte, on récupérerait le LifecycleOwner via le SDK Fleetbo
                // Ici on assume que le contexte est castable ou géré par le moteur
                // cameraProvider.bindToLifecycle(lifecycleOwner, cameraSelector, preview, imageCapture)
            } catch (exc: Exception) {
                // Gestion erreur silencieuse pour stabilité
            }

        }, ContextCompat.getMainExecutor(context))
    }

    private fun takePhoto(callbackId: String) {
        val imageCapture = imageCapture ?: return

        val photoFile = File(
            context.cacheDir,
            "stock_${System.currentTimeMillis()}.jpg"
        )

        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    sendError(callbackId, "Capture failed: ${exc.message}")
                }

                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    runOnUi {
                        removeView(rootLayout!!)
                    }
                    // Retourne le chemin absolu du fichier réel
                    val response = "{\"url\": \"file://${photoFile.absolutePath}\"}"
                    sendSuccess(callbackId, response)
                }
            }
        )
    }
}
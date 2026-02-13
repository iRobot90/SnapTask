// @Fleetbo ModuleName: CameraCapture

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class CameraCapture(private val context: Context) {

    private var imageCapture: ImageCapture? = null
    private lateinit var cameraExecutor: ExecutorService
    private val outputDirectory: File by lazy {
        val mediaDir = context.externalMediaDirs.firstOrNull()?.let {
            File(it, "FleetboCamera").apply { mkdirs() }
        }
        if (mediaDir != null && mediaDir.exists()) mediaDir else context.filesDir
    }

    fun getView(): View {
        cameraExecutor = Executors.newSingleThreadExecutor()
        
        val root = FrameLayout(context).apply {
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
        root.addView(viewFinder)

        // Capture Button
        val captureBtn = ImageView(context).apply {
            layoutParams = FrameLayout.LayoutParams(200, 200).apply {
                gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                bottomMargin = 100
            }
            // Simple white circle programmatically
            setBackgroundColor(Color.WHITE)
            // In a real app, use a proper drawable
            setOnClickListener {
                takePhoto()
            }
        }
        root.addView(captureBtn)

        // Close Button
        val closeBtn = ImageView(context).apply {
            layoutParams = FrameLayout.LayoutParams(100, 100).apply {
                gravity = Gravity.TOP or Gravity.START
                topMargin = 100
                leftMargin = 50
            }
            setBackgroundColor(Color.RED)
            setOnClickListener {
                // Fleetbo.close() // Signal cancellation
            }
        }
        root.addView(closeBtn)

        startCamera(viewFinder)

        return root
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
                // Note: In a real module, LifecycleOwner is injected by the OS wrapper
                // cameraProvider.bindToLifecycle(lifecycleOwner, cameraSelector, preview, imageCapture)
            } catch (exc: Exception) {
                // Handle errors
            }
        }, ContextCompat.getMainExecutor(context))
    }

    private fun takePhoto() {
        val imageCapture = imageCapture ?: return
        val photoFile = File(outputDirectory, "fleetbo_${System.currentTimeMillis()}.jpg")
        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    // Fleetbo.close(null)
                }
                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    // Return the URI string to JS
                    // Fleetbo.close(photoFile.absolutePath)
                }
            }
        )
    }
}
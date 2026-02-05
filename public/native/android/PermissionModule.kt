// @Fleetbo ModuleName: PermissionModule
import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

/**
 * Manages runtime permissions for the Android OS.
 * The Fleetbo Runtime provides the current activity context and handles the
 * asynchronous nature of permission requests, bridging the results back to JS.
 */
class PermissionModule(private val context: Context) {

    /**
     * Checks if a specific permission has already been granted.
     * @return A map with a 'status' key ('granted' or 'denied').
     */
    fun check(params: Map<String, Any>): Map<String, Any> {
        val permission = params["permission"] as? String 
            ?: return mapOf("status" to "error", "message" to "Missing permission name")
        
        val manifestPermission = getManifestPermission(permission)
        if (manifestPermission.isEmpty()) {
            return mapOf("status" to "error", "message" to "Unknown permission: $permission")
        }

        return if (ContextCompat.checkSelfPermission(context, manifestPermission) == PackageManager.PERMISSION_GRANTED) {
            mapOf("status" to "granted")
        } else {
            mapOf("status" to "denied")
        }
    }

    /**
     * Requests a permission from the user via a system dialog.
     * The Fleetbo Runtime will handle the async response and invoke the JS promise.
     * It will also emit PERMISSION_GRANTED or PERMISSION_DENIED events.
     */
    fun request(params: Map<String, Any>) {
        val activity = context as? Activity ?: return
        val permission = params["permission"] as? String ?: return
        val manifestPermission = getManifestPermission(permission)
        if (manifestPermission.isNotEmpty()) {
            ActivityCompat.requestPermissions(activity, arrayOf(manifestPermission), PERMISSION_REQUEST_CODE)
        }
    }

    /**
     * Opens the application's settings screen for the user to manually change permissions.
     */
    fun openSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", context.packageName, null)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    private fun getManifestPermission(permission: String): String {
        return when (permission.uppercase()) {
            "CAMERA" -> Manifest.permission.CAMERA
            // Future permissions can be mapped here
            else -> ""
        }
    }

    companion object {
        const val PERMISSION_REQUEST_CODE = 1001
    }
}
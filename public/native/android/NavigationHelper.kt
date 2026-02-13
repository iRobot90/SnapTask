// @Fleetbo ModuleName: NavigationHelper

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.widget.Toast

class NavigationHelper(private val context: Context) {

    fun goBack(callback: (Any?) -> Unit) {
        // Execute navigation logic on the main thread
        Handler(Looper.getMainLooper()).post {
            // In a real scenario, this interacts with the Activity's FragmentManager
            // For the module, we simulate the standardized back action
            Toast.makeText(context, "Navigation: Standardized Back Action", Toast.LENGTH_SHORT).show()
            
            // Return success to JS to let it know the command was received
            callback(true)
        }
    }
}
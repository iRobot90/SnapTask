// @Fleetbo ModuleName: SystemRouter
package com.fleetbo.modules.system

import android.content.Context
import android.util.Log

// This native module acts as a silent error interceptor.
// It suppresses system-level toasts for routing errors.

class SystemRouter(private val context: Context) {

    fun suppressSystemErrors() {
        // Logic to detach default exception handlers for navigation
        Log.d("FleetboOS", "SystemRouter: Nerdy errors suppressed. UI delegated to JS.")
    }

    fun logRoutingIssue(route: String) {
        // Silent logging for analytics, no UI interruption
        Log.w("FleetboOS", "Route missed: $route")
    }
}
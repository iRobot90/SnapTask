// @Fleetbo ModuleName: OfflineSyncQueue
package com.fleetbo.modules

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit

// This is a simplified representation. A real implementation would use a local DB like Room.
object LocalOperationStore {
    private val queue = mutableListOf<String>() // Stores serialized operations

    fun add(operationJson: String) {
        synchronized(this) {
            queue.add(operationJson)
        }
    }

    fun getAll(): List<String> {
        synchronized(this) {
            return queue.toList()
        }
    }

    fun clear() {
        synchronized(this) {
            queue.clear()
        }
    }
}

class SyncWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        // This is where you would communicate back to the JS layer.
        // val fleetboBridge = (applicationContext as FleetboApplication).bridge
        // fleetboBridge.emitEvent("SYNC_STATUS", mapOf("state" to "SYNCING"))

        val operations = LocalOperationStore.getAll()
        if (operations.isEmpty()) {
            // fleetboBridge.emitEvent("SYNC_STATUS", mapOf("state" to "SUCCESS"))
            return Result.success()
        }

        try {
            // --- SYNC LOGIC --- 
            // 1. Iterate through 'operations'.
            // 2. Deserialize each JSON string.
            // 3. Perform the corresponding Fleetbo.add/update/delete operation.
            // 4. If all succeed, clear the local store.
            
            // Simulating a network call
            kotlinx.coroutines.delay(2000)

            LocalOperationStore.clear()
            // fleetboBridge.emitEvent("SYNC_STATUS", mapOf("state" to "SUCCESS"))
            return Result.success()
        } catch (e: Exception) {
            // fleetboBridge.emitEvent("SYNC_STATUS", mapOf("state" to "FAILED", "error" to e.message))
            return Result.retry()
        }
    }
}

class OfflineSyncQueue {
    fun start(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncWorkRequest = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(constraints)
            .setBackoffCriteria(
                BackoffPolicy.EXPONENTIAL,
                OneTimeWorkRequest.MIN_BACKOFF_MILLIS,
                TimeUnit.MILLISECONDS
            )
            .build()

        WorkManager.getInstance(context).enqueueUniqueWork(
            "fleetbo-sync-worker",
            ExistingWorkPolicy.KEEP,
            syncWorkRequest
        )
    }

    fun queueOperation(context: Context, operationJson: String) {
        LocalOperationStore.add(operationJson)
        // Trigger a sync attempt immediately if network is available
        start(context)
    }
}
// @Fleetbo ModuleName: TaskScheduler
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

// This is a placeholder for the actual bridge to communicate with JS
object FleetboBridge {
    fun emitEvent(eventName: String, data: Map<String, Any>) { 
        // Internal Fleetbo engine logic sends this to the JS layer
    }
}

class TaskSchedulerModule(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    companion object {
        const val NOTIFICATION_CHANNEL_ID = "fleetbo_reminders"
    }

    init {
        createNotificationChannel()
    }

    fun schedule(params: Map<String, Any>) {
        val id = params["id"] as? String ?: return
        val title = params["title"] as? String ?: "Reminder"
        val message = params["message"] as? String ?: ""
        val timestamp = (params["timestamp"] as? Number)?.toLong() ?: return

        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("TASK_ID", id)
            putExtra("TASK_TITLE", title)
            putExtra("TASK_MESSAGE", message)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode(), intent, 
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            // Handle case where exact alarms are not permitted
            return
        }

        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent)
        FleetboBridge.emitEvent("REMINDER_SET", mapOf("taskId" to id, "status" to "success"))
    }

    fun cancel(params: Map<String, Any>) {
        val id = params["id"] as? String ?: return
        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode(), intent, 
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Task Reminders"
            val descriptionText = "Notifications for scheduled tasks"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val taskId = intent.getStringExtra("TASK_ID") ?: return
        val taskTitle = intent.getStringExtra("TASK_TITLE") ?: "Reminder"
        val taskMessage = intent.getStringExtra("TASK_MESSAGE") ?: ""

        FleetboBridge.emitEvent("REMINDER_TRIGGERED", mapOf("taskId" to taskId))

        // Intent to open the app on tap
        val openAppIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)!!.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            // Fleetbo engine will route this to the correct page
            putExtra("fleetbo_open_page", "TaskDetail")
            putExtra("fleetbo_page_id", taskId)
        }
        val openAppPendingIntent = PendingIntent.getActivity(context, taskId.hashCode(), openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        // 'Mark Complete' action
        val completeIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = "ACTION_COMPLETE"
            putExtra("TASK_ID", taskId)
        }
        val completePendingIntent = PendingIntent.getBroadcast(context, taskId.hashCode() + 1, completeIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        // 'Snooze' action
        val snoozeIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = "ACTION_SNOOZE"
            putExtra("TASK_ID", taskId)
        }
        val snoozePendingIntent = PendingIntent.getBroadcast(context, taskId.hashCode() + 2, snoozeIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        val builder = NotificationCompat.Builder(context, TaskSchedulerModule.NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(taskTitle)
            .setContentText(taskMessage)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(openAppPendingIntent)
            .setAutoCancel(true)
            .addAction(0, "Mark Complete", completePendingIntent)
            .addAction(0, "Snooze", snoozePendingIntent)

        with(NotificationManagerCompat.from(context)) {
            notify(taskId.hashCode(), builder.build())
        }
    }
}

class NotificationActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val taskId = intent.getStringExtra("TASK_ID") ?: return
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.cancel(taskId.hashCode())

        when (intent.action) {
            "ACTION_COMPLETE" -> FleetboBridge.emitEvent("REMINDER_ACTION_COMPLETE", mapOf("taskId" to taskId))
            "ACTION_SNOOZE" -> FleetboBridge.emitEvent("REMINDER_ACTION_SNOOZE", mapOf("taskId" to taskId))
        }
    }
}
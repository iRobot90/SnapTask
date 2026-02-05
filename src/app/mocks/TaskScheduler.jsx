import { useEffect } from 'react';

// This is a headless mock component for the TaskScheduler native module.
// It simulates the scheduling and triggering of reminders using setTimeout
// and dispatches events that the application code can listen for via Fleetbo.on.
// It is used exclusively within the Fleetbo virtual environment.

const TaskScheduler = () => {
  useEffect(() => {
    const scheduledTasks = new Map();

    const handleSchedule = (event) => {
      const { detail: task } = event;
      if (!task || !task.id || !task.timestamp) {
        console.error('[Mock TaskScheduler] Invalid task data for schedule.');
        return;
      }

      // Clear any existing timer for this task ID
      if (scheduledTasks.has(task.id)) {
        clearTimeout(scheduledTasks.get(task.id));
      }

      const delay = task.timestamp - Date.now();
      if (delay < 0) {
        console.warn(`[Mock TaskScheduler] Task ${task.id} is scheduled in the past.`);
        return;
      }

      console.log(`[Mock TaskScheduler] Scheduling task "${task.title}" (${task.id}) to trigger in ${delay}ms.`);

      const timeoutId = setTimeout(() => {
        console.log(`[Mock TaskScheduler] Triggering reminder for task: ${task.id}`);
        window.dispatchEvent(new CustomEvent('REMINDER_TRIGGERED', { detail: { taskId: task.id } }));
        scheduledTasks.delete(task.id);
      }, delay);

      scheduledTasks.set(task.id, timeoutId);
      window.dispatchEvent(new CustomEvent('REMINDER_SET', { detail: { taskId: task.id, status: 'success' } }));
    };

    const handleCancel = (event) => {
      const { detail: { taskId } } = event;
      if (scheduledTasks.has(taskId)) {
        console.log(`[Mock TaskScheduler] Cancelling task: ${taskId}`);
        clearTimeout(scheduledTasks.get(taskId));
        scheduledTasks.delete(taskId);
      }
    };

    // The Fleetbo virtual environment dispatches these custom events when Fleetbo.exec is called.
    window.addEventListener('Fleetbo.exec.TaskScheduler.schedule', handleSchedule);
    window.addEventListener('Fleetbo.exec.TaskScheduler.cancel', handleCancel);

    return () => {
      window.removeEventListener('Fleetbo.exec.TaskScheduler.schedule', handleSchedule);
      window.removeEventListener('Fleetbo.exec.TaskScheduler.cancel', handleCancel);
      // Clear all scheduled timeouts on cleanup
      scheduledTasks.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  // This component renders nothing. It's a background service mock.
  return null;
};

export default TaskScheduler;
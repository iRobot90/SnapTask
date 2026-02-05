import { useEffect, useState } from 'react';
function TaskDetail() {
  const [task, setTask] = useState(null);
  const taskId = window.location.pathname.split('/').pop();
  useEffect(() => {
    Fleetbo.log('TaskDetail');
    Fleetbo.onWebPageReady();
    Fleetbo.getDoc('Tasks', 'UserTasks', taskId).then(setTask);
  }, [taskId]);
  const toggleComplete = () => {
    const updatedTask = { ...task, completed: !task.completed };
    Fleetbo.addWithId('Tasks', 'UserTasks', updatedTask, taskId);
    setTask(updatedTask);
  };
  const setReminder = () => {
    const reminderTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // ALEX FIX: Use 'TaskScheduler' and timestamp number
    Fleetbo.exec('TaskScheduler', 'schedule', {
      id: taskId,
      title: task.title,
      message: 'Time to work on this task!',
      timestamp: reminderTime.getTime()
    });

    alert('Reminder set for 1 hour!');
  };
  const deleteTask = () => {
    if (window.confirm('Delete this task?')) {
      Fleetbo.delete('Tasks', 'UserTasks', taskId);
      Fleetbo.back();
    }
  };
  if (!task) return <div>Loading...</div>;
  return (
    <div className="task-detail">
      <button onClick={() => Fleetbo.back()}>← Back</button>

      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>

      {task.photoUri && (
        <img src={task.photoUri} alt="Task attachment" style={{ maxWidth: '100%', marginTop: '20px' }} />
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleComplete}>
          {task.completed ? '✓ Mark Incomplete' : '○ Mark Complete'}
        </button>

        <button onClick={setReminder} style={{ marginLeft: '10px' }}>
          ⏰ Remind Me (1h)
        </button>

        <button onClick={deleteTask} style={{ marginLeft: '10px', background: '#e74c3c' }}>
          Delete Task
        </button>
      </div>
    </div>
  );
}
export default TaskDetail;
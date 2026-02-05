import { useEffect, useState } from 'react';
function TaskList() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    Fleetbo.log('TaskList');
    Fleetbo.onWebPageReady();
    // Fetch user tasks (offline-safe)
    Fleetbo.getDocsU('Tasks', 'UserTasks').then(setTasks);
    // Real-time listener
    Fleetbo.listenToDocs('Tasks', 'UserTasks', setTasks);
    return () => Fleetbo.stopListening('Tasks', 'UserTasks');
  }, []);

  useEffect(() => {
    Fleetbo.on('SYNC_COMPLETED', (data) => {
      console.log(`Synced ${data.count} items`);
    });

    Fleetbo.on('SYNC_FAILED', (error) => {
      console.error('Sync failed:', error);
    });
  }, []);
  return (
    <div className="task-list">
      <h1>My Tasks</h1>

      <button onClick={() => Fleetbo.openPage('TaskCreate')}>+ New Task</button>

      <div className="tasks">
        {tasks.map(task => (
          <div
            key={task.id}
            className="task-item"
            onClick={() => Fleetbo.openPageId('TaskDetail', task.id)}
          >
            {task.photoUri && <img src={task.photoUri} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span>{task.completed ? '✓ Complete' : '○ Pending'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TaskList;
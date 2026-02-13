import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(loadTasks, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem('tasks');
      const taskList = stored ? JSON.parse(stored) : [];
      setTasks(taskList);
    } catch (e) {
      setTasks([]);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: 20, padding: 0 }}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>My Tasks</h2>
        <button onClick={() => navigate('/createtask')} style={{ backgroundColor: '#0E904D', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}>
          + New
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#666' }}>
          No tasks yet. Create your first task!
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/taskdetail/${task.id}`)}
              style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                padding: 12, 
                marginBottom: 10,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                  {task.description && (
                    <div style={{ color: '#666', fontSize: 14 }}>{task.description}</div>
                  )}
                  <div style={{ color: '#999', fontSize: 12 }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {task.photoUri && (
                  <img
                    src={task.photoUri}
                    alt="Task"
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTask();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTask = () => {
    try {
      const stored = localStorage.getItem('tasks');
      const tasks = stored ? JSON.parse(stored) : [];
      const foundTask = tasks.find(t => t.id === id);
      setTask(foundTask || null);
    } catch (e) {
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!task) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    try {
      const stored = localStorage.getItem('tasks');
      const tasks = stored ? JSON.parse(stored) : [];
      const updatedTasks = tasks.filter(t => t.id !== id);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigate('/tasklist');
    } catch (e) {
      alert('Error deleting task.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 16 }}>Loading...</div>;
  }

  if (!task) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => navigate('/tasklist')} style={{ background: 'none', border: 'none', fontSize: 24, padding: 0 }}>
            ←
          </button>
          <h2 style={{ margin: 0 }}>Task Details</h2>
          <div style={{ width: 30 }} />
        </div>
        <p>Task not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => navigate('/tasklist')} style={{ background: 'none', border: 'none', fontSize: 24, padding: 0 }}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>Task Details</h2>
        <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}>
          Delete
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{task.title}</div>
        {task.description && <div style={{ color: '#666', marginBottom: 12 }}>{task.description}</div>}
        <div style={{ color: '#999', fontSize: 14 }}>
          Created: {new Date(task.createdAt).toLocaleString()}
        </div>
        {task.photoUri && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Attached Photo:</div>
            <img src={task.photoUri} alt="Task" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 8,
            width: '85%',
            maxWidth: 320
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 18 }}>Delete Task?</h3>
            <p style={{ margin: '0 0 24px 0', color: '#666' }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', border: 'none', color: '#666', fontWeight: 'bold', padding: '8px 12px' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={{ background: 'none', border: 'none', color: '#dc3545', fontWeight: 'bold', padding: '8px 12px' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetail;

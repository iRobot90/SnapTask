import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Fleetbo = window.Fleetbo;

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.photoUri) {
      setPhotoUri(location.state.photoUri);
      if (location.state.title) setTitle(location.state.title);
      if (location.state.description) setDescription(location.state.description);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTakePhoto = () => {
    if (Fleetbo && typeof Fleetbo.openPage === 'function') {
      Fleetbo.openPage('camera').then(result => {
        if (result && result.uri) {
          setPhotoUri(result.uri);
        }
      }).catch(err => {
        console.error('Camera error:', err);
      });
    } else {
      navigate('/camera', { state: { title, description, returnTo: '/createtask' } });
    }
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      alert('Task title cannot be empty.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      photoUri: photoUri,
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem('tasks');
    const tasks = stored ? JSON.parse(stored) : [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    navigate('/tasklist');
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => navigate('/tasklist')} style={{ background: 'none', border: 'none', fontSize: 24, padding: 0 }}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>New Task</h2>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Task Title</label>
        <input
          type="text"
          style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Description</label>
        <textarea
          style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ddd', minHeight: 80 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <button 
        onClick={handleTakePhoto}
        style={{ backgroundColor: '#0E904D', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 4, marginRight: 8 }}
      >
        📷 Take Photo
      </button>

      {photoUri && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Captured Photo:</div>
          <img src={photoUri} alt="Captured" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      )}

      <button 
        onClick={handleSaveTask}
        disabled={!title.trim()}
        style={{ 
          backgroundColor: title.trim() ? '#28a745' : '#ccc', 
          color: 'white', 
          border: 'none', 
          padding: 14, 
          borderRadius: 4, 
          width: '100%', 
          marginTop: 16,
          fontSize: 16
        }}
      >
        Save Task
      </button>
    </div>
  );
}

export default CreateTask;

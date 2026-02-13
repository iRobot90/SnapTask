import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, Camera, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ 
          backgroundColor: '#0E904D', 
          color: 'white', 
          borderRadius: '50%', 
          padding: 30, 
          display: 'inline-block',
          marginBottom: 15 
        }}>
          <ListTodo size={40} />
        </div>
        <h2>SnapTask</h2>
        <p style={{ color: '#666' }}>Capture tasks with photos. Work offline.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          style={{
            backgroundColor: '#0E904D',
            color: 'white',
            border: 'none',
            padding: 16,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => navigate('/createtask')}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Camera size={24} style={{ marginRight: 12 }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>New Task</div>
              <small style={{ opacity: 0.8 }}>Capture a task with photo</small>
            </div>
          </div>
          <ArrowRight size={20} />
        </button>

        <button
          style={{
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => navigate('/tasklist')}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ListTodo size={24} style={{ marginRight: 12 }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>My Tasks</div>
              <small style={{ color: '#666' }}>View all your tasks</small>
            </div>
          </div>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, Info, Bell, User, Wifi, WifiOff, Trash2, RefreshCw } from 'lucide-react';
import { PageConfig } from '@fleetbo';

const Profile = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  // Signal page ready
  useEffect(() => {
    console.log('Profile: Component mounted');
    if (window.Fleetbo && window.Fleetbo.onWebPageReady) {
      window.Fleetbo.onWebPageReady();
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const storageKey = 'snap_tasks';
      const stored = localStorage.getItem(storageKey);
      const tasks = stored ? JSON.parse(stored) : [];
      setStats({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length
      });
    } catch (error) {
      console.error('Profile: Load stats error:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();

    // Monitor connectivity
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadStats]);

  // Go back to home
  const goBack = () => {
    console.log('Profile: Going back to home');
    navigate('/home');
  };

  // Clear all data
  const handleClearData = useCallback(async () => {
    const confirmed = window.confirm('Are you sure you want to delete all tasks? This cannot be undone.');
    if (!confirmed) return;

    try {
      localStorage.removeItem('snap_tasks');
      loadStats();
      alert('All tasks deleted');
    } catch (error) {
      alert('Failed to clear data');
    }
  }, [loadStats]);

  // Refresh stats
  const handleRefresh = useCallback(async () => {
    await loadStats();
    alert('Data refreshed');
  }, [loadStats]);

  const MenuItem = ({ icon: Icon, title, subtitle, onClick, danger }) => (
    <div 
      className="list-group-item d-flex align-items-center p-3"
      onClick={onClick}
      style={{ cursor: 'pointer', background: 'transparent', borderBottom: '1px solid #f0f0f0' }}
    >
      <div className={`p-2 rounded-circle me-3 ${danger ? 'bg-danger bg-opacity-10' : 'bg-light'}`}>
        <Icon size={20} className={danger ? 'text-danger' : 'text-muted'} />
      </div>
      <div className="flex-grow-1">
        <h6 className={`mb-0 ${danger ? 'text-danger' : ''}`}>{title}</h6>
        <small className="text-muted">{subtitle}</small>
      </div>
      <span style={{ color: '#999' }}>›</span>
    </div>
  );

  return (
    <>
      <PageConfig navbar="show" />
      <div className="container py-4 px-3">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            type="button"
            onClick={goBack}
            className="btn btn-link p-0 me-3 text-dark"
            style={{ textDecoration: 'none', fontSize: '24px' }}
          >
            ←
          </button>
          <h2 className="mb-0 fw-bold">Profile</h2>
        </div>

        {/* User Info */}
        <div className="text-center mb-4">
          <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
              <User size={28} />
            </div>
          </div>
          <h4 className="fw-bold">SnapTask User</h4>
          <div className={`d-inline-flex align-items-center px-2 py-1 rounded-pill mt-1 ${isOnline ? 'bg-success' : 'bg-secondary'}`}>
            {isOnline ? <Wifi size={12} className="text-white me-1" /> : <WifiOff size={12} className="text-white me-1" />}
            <span className="text-white small">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="card border-0 bg-light rounded-4 p-0 mb-4 overflow-hidden">
          <div className="p-3 bg-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Task Statistics</h6>
              <button type="button" className="btn btn-sm btn-light rounded-circle" onClick={handleRefresh}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <div className="row g-0 p-3">
            <div className="col-4 text-center">
              <div className="h3 mb-0 fw-bold text-primary">{stats.total}</div>
              <small className="text-muted">Total</small>
            </div>
            <div className="col-4 text-center">
              <div className="h3 mb-0 fw-bold text-success">{stats.completed}</div>
              <small className="text-muted">Done</small>
            </div>
            <div className="col-4 text-center">
              <div className="h3 mb-0 fw-bold text-warning">{stats.pending}</div>
              <small className="text-muted">Pending</small>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="card border-0 bg-light rounded-4 p-0 mb-4 overflow-hidden">
          <div className="list-group list-group-flush">
            <MenuItem 
              icon={Settings} 
              title="Settings" 
              subtitle="App preferences"
              onClick={() => alert('Settings coming soon')}
            />
            <MenuItem 
              icon={Bell} 
              title="Notifications" 
              subtitle="Manage notifications"
              onClick={() => alert('Notifications coming soon')}
            />
            <MenuItem 
              icon={HelpCircle} 
              title="Help & Support" 
              subtitle="Get help"
              onClick={() => alert('Help coming soon')}
            />
            <MenuItem 
              icon={Info} 
              title="About" 
              subtitle="App information"
              onClick={() => alert('SnapTask v1.0.0')}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-0 bg-danger bg-opacity-10 rounded-4 p-0 mb-4">
          <div className="list-group list-group-flush">
            <div 
              className="list-group-item d-flex align-items-center p-3"
              onClick={handleClearData}
              style={{ cursor: 'pointer', background: 'transparent' }}
            >
              <div className="p-2 rounded-circle me-3 bg-danger bg-opacity-10">
                <Trash2 size={20} className="text-danger" />
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0 text-danger">Clear All Data</h6>
                <small className="text-muted">Delete all tasks</small>
              </div>
              <span style={{ color: '#999' }}>›</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted">
          <small>SnapTask v1.0.0</small>
          <br />
          <small>Built with Fleetbo</small>
        </div>
      </div>
    </>
  );
};

export default Profile;

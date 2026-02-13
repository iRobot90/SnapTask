// FleetboEventMonitor.js - Fixed Event Monitoring Dashboard
import FleetboEventSystem from './FleetboEventSystem';

class FleetboEventMonitor {
  constructor() {
    this.eventSystem = new FleetboEventSystem();
    this.isMonitoring = false;
    this.eventCounts = {
      total: 0,
      navigation: 0,
      storage: 0,
      camera: 0,
      sync: 0,
      connectivity: 0,
      errors: 0,
      tasks: 0
    };
    this.eventLog = [];
    this.maxLogSize = 100;
    this.updateInterval = null;
  }

  startMonitoring() {
    console.log('📊 FleetboEventMonitor: Starting event monitoring...');
    this.isMonitoring = true;
    
    // Set up dashboard update interval
    this.updateInterval = setInterval(() => {
      this.updateDashboard();
    }, 1000);
    
    // Set up dashboard and Fleetbo event listeners
    this.setupDashboard();
    this.setupFleetboListeners();
    
    console.log('✅ FleetboEventMonitor: Event monitoring started');
  }

  stopMonitoring() {
    console.log('📊 FleetboEventMonitor: Stopping event monitoring...');
    this.isMonitoring = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('✅ FleetboEventMonitor: Event monitoring stopped');
  }

  setupDashboard() {
    console.log('📊 FleetboEventMonitor: Setting up dashboard...');
    
    // Create dashboard HTML
    const dashboardHtml = this.createDashboardHtml();
    const dashboardContainer = document.createElement('div');
    dashboardContainer.innerHTML = dashboardHtml;
    
    // Add to page
    document.body.appendChild(dashboardContainer);
    
    // Add custom styles
    this.addDashboardStyles();
    
    console.log('✅ FleetboEventMonitor: Dashboard created');
  }

  createDashboardHtml() {
    return `
      <div id="fleetbo-event-dashboard" class="container-fluid mt-4">
        <div class="card">
          <div class="card-header">
            <h4>📊 Fleetbo Event Monitor</h4>
            <span class="badge bg-success ms-2">Live</span>
          </div>
          <div class="card-body">
            <div id="event-counts">
              <div class="row text-center mb-3">
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-primary">${this.eventCounts.total}</h4>
                      <small>Total Events</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-info">${this.eventCounts.navigation}</h4>
                      <small>Navigation</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-warning">${this.eventCounts.storage}</h4>
                      <small>Storage</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-success">${this.eventCounts.camera}</h4>
                      <small>Camera</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-info">${this.eventCounts.sync}</h4>
                      <small>Sync</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-warning">${this.eventCounts.connectivity}</h4>
                      <small>Connectivity</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-danger">${this.eventCounts.errors}</h4>
                      <small>Errors</small>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="card">
                    <div class="card-body text-center">
                      <h4 class="text-success">${this.eventCounts.tasks}</h4>
                      <small>Tasks</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-12">
              <h5 class="mb-3">Recent Events</h5>
            </div>
            <div class="col-12">
              <div id="event-log" style="height: 400px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
                <div class="text-muted">Waiting for events...</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-6">
            <button class="btn btn-success" onclick="window.FleetboEventMonitor.clearEventLog()">
              <i class="fas fa-trash me-2"></i> Clear Log
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-warning" onclick="window.FleetboEventMonitor.pauseMonitoring()">
              <i class="fas fa-pause me-2"></i> Pause
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary" onclick="window.FleetboEventMonitor.resumeMonitoring()">
              <i class="fas fa-play me-2"></i> Resume
            </button>
          </div>
        </div>
      </div>
    `;
  }

  addDashboardStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #fleetbo-event-dashboard {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
      
      #fleetbo-event-dashboard .card {
        margin-bottom: 1rem;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        border-radius: 0.5rem;
      }
      
      #fleetbo-event-dashboard .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: bold;
        padding: 1rem;
      }
      
      #fleetbo-event-dashboard .badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
      }
      
      #fleetbo-event-dashboard .card-body {
        padding: 1rem;
      }
      
      #fleetbo-event-dashboard h4 {
        margin-bottom: 0;
        color: #495057;
      }
      
      #fleetbo-event-dashboard h5 {
        margin-bottom: 1rem;
        color: #6c757d;
      }
      
      #fleetbo-event-dashboard .small {
        font-size: 0.75rem;
        opacity: 0.8;
      }
      
      #fleetbo-event-dashboard #event-log {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 12px;
      }
      
      #fleetbo-event-dashboard .btn {
        margin: 0.25rem;
        border-radius: 0.375rem;
        font-weight: 500;
        transition: all 0.15s ease;
      }
      
      #fleetbo-event-dashboard .btn:hover {
        transform: translateY(-1px);
      }
    `;
    
    document.head.appendChild(style);
  }

  updateDashboard() {
    if (!this.isMonitoring) return;
    
    const dashboard = document.getElementById('fleetbo-event-dashboard');
    if (!dashboard) return;
    
    // Update counts
    const countsElement = dashboard.querySelector('#event-counts');
    if (countsElement) {
      countsElement.innerHTML = `
        <div class="row text-center mb-3">
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-primary">${this.eventCounts.total}</h4>
                <small>Total Events</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-info">${this.eventCounts.navigation}</h4>
                <small>Navigation</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-warning">${this.eventCounts.storage}</h4>
                <small>Storage</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-success">${this.eventCounts.camera}</h4>
                <small>Camera</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-info">${this.eventCounts.sync}</h4>
                <small>Sync</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-warning">${this.eventCounts.connectivity}</h4>
                <small>Connectivity</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-danger">${this.eventCounts.errors}</h4>
                <small>Errors</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body text-center">
                <h4 class="text-success">${this.eventCounts.tasks}</h4>
                <small>Tasks</small>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Update event log
    this.updateEventLog();
  }

  addEventToLog(event) {
    this.eventLog.unshift(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(0, this.maxLogSize);
    }
    
    // Update counts
    if (event.name.includes('navigation')) this.eventCounts.navigation++;
    else if (event.name.includes('storage')) this.eventCounts.storage++;
    else if (event.name.includes('camera')) this.eventCounts.camera++;
    else if (event.name.includes('sync')) this.eventCounts.sync++;
    else if (event.name.includes('connectivity')) this.eventCounts.connectivity++;
    else if (event.name.includes('error')) this.eventCounts.errors++;
    else if (event.name.includes('task')) this.eventCounts.tasks++;
    
    this.eventCounts.total++;
  }

  updateEventLog() {
    const logElement = document.getElementById('event-log');
    if (!logElement) return;
    
    const eventsHtml = this.eventLog.slice(0, 20).map(event => {
      const timestamp = new Date(event.timestamp).toLocaleTimeString();
      const typeIcon = this.getEventIcon(event.name);
      return `
        <div style="border-bottom: 1px solid #e9ecef; padding: 8px; margin-bottom: 4px;">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              ${typeIcon}
              <strong>${event.name}</strong>
              <small class="text-muted ms-2">${timestamp}</small>
            </div>
            <div class="text-end">
              <small class="badge bg-info">ID: ${event.id}</small>
            </div>
          </div>
          ${event.data ? `
            <div class="mt-2">
              <div class="text-muted">${JSON.stringify(event.data, null, 2)}</div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    logElement.innerHTML = eventsHtml || '<div class="text-center text-muted">No events yet</div>';
    
    // Auto-scroll to top
    logElement.scrollTop = 0;
  }

  getEventIcon(eventName) {
    if (eventName.includes('navigation')) return '🧭';
    if (eventName.includes('storage')) return '💾';
    if (eventName.includes('camera')) return '📸';
    if (eventName.includes('sync')) return '☁️';
    if (eventName.includes('connectivity')) return '📶';
    if (eventName.includes('task')) return '📋';
    if (eventName.includes('error')) return '❌';
    return '📄';
  }

  setupFleetboListeners() {
    // Setup Alex event listeners
    try {
      if (typeof Fleetbo !== 'undefined') {
        Fleetbo.on('ALEX_RUNTIME_READY', () => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexRuntimeReady',
            data: { status: 'ready' },
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_MODULE_CALL', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexModuleCall',
            data: {
              module: data.module,
              action: data.action,
              params: data.params,
              result: data.result
            },
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_MODULE_ERROR', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexModuleError',
            data: {
              module: data.module,
              action: data.action,
              params: data.params,
              error: data.error
            },
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_TASK_CREATED', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexTaskCreated',
            data: data,
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_TASK_UPDATED', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexTaskUpdated',
            data: data,
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_TASK_DELETED', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexTaskDeleted',
            data: data,
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_STORAGE_OPERATION', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexStorageOperation',
            data: data,
            timestamp: new Date().toISOString()
          });
        });
        
        Fleetbo.on('ALEX_SYNC_OPERATION', (data) => {
          this.addEventToLog({
            id: this.generateEventId(),
            name: 'alexSyncOperation',
            data: data,
            timestamp: new Date().toISOString()
          });
        });
      }
    } catch (error) {
      console.log('⚠️ FleetboEventMonitor: Alex listeners not available:', error);
    }
  }

  generateEventId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  clearEventLog() {
    this.eventLog = [];
    this.eventCounts.total = 0;
    this.eventCounts.navigation = 0;
    this.eventCounts.storage = 0;
    this.eventCounts.camera = 0;
    this.eventCounts.sync = 0;
    this.eventCounts.connectivity = 0;
    this.eventCounts.errors = 0;
    this.eventCounts.tasks = 0;
    
    const logElement = document.getElementById('event-log');
    if (logElement) {
      logElement.innerHTML = '<div class="text-center text-muted">Event log cleared</div>';
    }
    
    console.log('🗑️ FleetboEventMonitor: Event log cleared');
  }

  pauseMonitoring() {
    this.isMonitoring = false;
    console.log('⏸️ FleetboEventMonitor: Event monitoring paused');
  }

  resumeMonitoring() {
    this.isMonitoring = true;
    console.log('▶️ FleetboEventMonitor: Event monitoring resumed');
  }

  getSystemHealth() {
    return {
      monitoring: this.isMonitoring,
      dashboardExists: !!document.getElementById('fleetbo-event-dashboard'),
      eventSystem: this.eventSystem.getStats(),
      lastEvent: this.eventLog[0] || null,
      uptime: this.isMonitoring ? 'Active' : 'Inactive'
    };
  }

  getEventStats() {
    return {
      eventCounts: this.eventCounts,
      recentEvents: this.eventLog.slice(0, 10),
      isMonitoring: this.isMonitoring,
      logSize: this.eventLog.length
    };
  }
}

// Create and export singleton instance
const fleetboEventMonitorInstance = new FleetboEventMonitor();

// Global instance for window access
if (typeof window !== 'undefined') {
  window.FleetboEventMonitor = fleetboEventMonitorInstance;
}

export default fleetboEventMonitorInstance;

// Auto-start monitoring when loaded
console.log('🚀 FleetboEventMonitor: Ready to start monitoring');
console.log('Call FleetboEventMonitor.startMonitoring() to begin');
console.log('Call FleetboEventMonitor.getSystemHealth() to check system status');
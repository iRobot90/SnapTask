// FleetboEventSystem.js - Fixed Event System (no syntax errors)
export class FleetboEventSystem {
  constructor() {
    this.listeners = new Map();
    this.eventQueue = [];
    this.isProcessing = false;
    this.eventHistory = [];
    this.maxHistory = 100;

    // Fleetbo Alex integration
    this.fleetboAlexConnected = false;
    this.alexCallCount = 0;

    this.init();
  }

  async init() {
    console.log('🔊 FleetboEventSystem: Initializing event system...');

    try {
      await this.initializeFleetboAlex();
      this.setupBaseEventListeners();
      console.log('✅ FleetboEventSystem: Event system initialized');
    } catch (error) {
      console.error('❌ FleetboEventSystem: Event system initialization failed:', error);
      this.setupFallbackEventSystem();
    }
  }

  async initializeFleetboAlex() {
    if (typeof Fleetbo === 'undefined') {
      console.log('⚠️ FleetboEventSystem: Fleetbo not available, using fallback');
      return;
    }

    try {
      await Fleetbo.exec('AlexRuntime', 'checkConnection');
      this.fleetboAlexConnected = true;
      this.alexCallCount++;
      console.log('✅ FleetboEventSystem: Fleetbo Alex connected');
      this.setupAlexEventListeners();
    } catch (error) {
      console.log('⚠️ FleetboEventSystem: Fleetbo Alex connection failed:', error);
      this.fleetboAlexConnected = false;
    }
  }

  setupBaseEventListeners() {
    try {
      Fleetbo.on('CONNECTIVITY_CHANGE', (data) => {
        this.emitEvent('connectivityChange', data);
      });
    } catch (error) {
      console.log('ℹ️ FleetboEventSystem: Connectivity monitoring not available');
    }
  }

  setupAlexEventListeners() {
    try {
      Fleetbo.on('ALEX_RUNTIME_READY', () => {
        this.emitEvent('alexRuntimeReady', { status: 'ready' });
      });

      Fleetbo.on('ALEX_MODULE_CALL', (data) => {
        this.alexCallCount++;
        this.emitEvent('alexModuleCall', {
          module: data.module,
          action: data.action,
          params: data.params,
          result: data.result,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_MODULE_ERROR', (data) => {
        this.emitEvent('alexModuleError', {
          module: data.module,
          action: data.action,
          params: data.params,
          error: data.error,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_CAMERA_CAPTURE', (data) => {
        this.emitEvent('alexCameraCapture', {
          photoData: data.photoData,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_TASK_CREATED', (data) => {
        this.emitEvent('alexTaskCreated', {
          taskData: data.taskData,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_TASK_UPDATED', (data) => {
        this.emitEvent('alexTaskUpdated', {
          taskId: data.taskId,
          changes: data.changes,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_TASK_DELETED', (data) => {
        this.emitEvent('alexTaskDeleted', {
          taskId: data.taskId,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_STORAGE_OPERATION', (data) => {
        this.emitEvent('alexStorageOperation', {
          operation: data.operation,
          key: data.key,
          success: data.success,
          timestamp: new Date().toISOString()
        });
      });

      Fleetbo.on('ALEX_SYNC_OPERATION', (data) => {
        this.emitEvent('alexSyncOperation', {
          operation: data.operation,
          count: data.count,
          status: data.status,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.log('⚠️ FleetboEventSystem: Alex event listeners setup failed:', error);
    }
  }

  // ================================
  // EVENT EMITERS
  // ================================
  emitEvent(eventName, data = {}, category = 'general') {
    const event = {
      id: Date.now().toString(),
      name: eventName,
      category,
      data,
      timestamp: new Date().toISOString(),
      source: 'FleetboEventSystem'
    };

    this.eventQueue.push(event);
    console.log(`🔊 FleetboEventSystem: Event emitted: ${eventName}`, data);
  }

  async processEventQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('❌ FleetboEventSystem: Event processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async processEvent(event) {
    console.log(`🔄 FleetboEventSystem: Processing event: ${event.name}`);

    switch (event.name) {
      case 'navigationStart':
        this.handleNavigationStart(event);
        break;
      case 'navigationEnd':
        this.handleNavigationEnd(event);
        break;
      case 'navigationError':
        this.handleNavigationError(event);
        break;
      case 'storageSaveStart':
        this.handleStorageSaveStart(event);
        break;
      case 'storageSaveEnd':
        this.handleStorageSaveEnd(event);
        break;
      case 'storageSaveError':
        this.handleStorageSaveError(event);
        break;
      case 'cameraPermissionRequested':
        this.handleCameraPermissionRequested(event);
        break;
      case 'cameraPermissionGranted':
        this.handleCameraPermissionGranted(event);
        break;
      case 'cameraPermissionDenied':
        this.handleCameraPermissionDenied(event);
        break;
      case 'cameraCaptureStart':
        this.handleCameraCaptureStart(event);
        break;
      case 'cameraCaptureSuccess':
        this.handleCameraCaptureSuccess(event);
        break;
      case 'cameraCaptureError':
        this.handleCameraCaptureError(event);
        break;
      case 'syncStart':
        this.handleSyncStart(event);
        break;
      case 'syncProgress':
        this.handleSyncProgress(event);
        break;
      case 'syncComplete':
        this.handleSyncComplete(event);
        break;
      case 'syncError':
        this.handleSyncError(event);
        break;
      case 'connectivityChange':
        this.handleConnectivityChange(event);
        break;
      case 'alexRuntimeReady':
        this.handleAlexRuntimeReady(event);
        break;
      case 'alexModuleCall':
        this.handleAlexModuleCall(event);
        break;
      case 'alexModuleError':
        this.handleAlexModuleError(event);
        break;
      case 'alexCameraCapture':
        this.handleAlexCameraCapture(event);
        break;
      case 'alexTaskCreated':
        this.handleAlexTaskCreated(event);
        break;
      case 'alexTaskUpdated':
        this.handleAlexTaskUpdated(event);
        break;
      case 'alexTaskDeleted':
        this.handleAlexTaskDeleted(event);
        break;
      case 'alexStorageOperation':
        this.handleAlexStorageOperation(event);
        break;
      case 'alexSyncOperation':
        this.handleAlexSyncOperation(event);
        break;
      default:
        this.handleGenericEvent(event);
    }

    this.callListeners(event.name, event.data);
  }

  handleNavigationStart(event) {
    console.log('🧭 Navigation started:', event.data);
    this.callListeners('navigationStart', event.data);
  }

  handleNavigationEnd(event) {
    console.log('🧭 Navigation completed:', event.data);
    this.callListeners('navigationEnd', event.data);
  }

  handleNavigationError(event) {
    console.log('❌ Navigation error:', event.data);
    this.callListeners('navigationError', event.data);
  }

  handleStorageSaveStart(event) {
    console.log('💾 Storage save started:', event.data);
    this.callListeners('storageSaveStart', event.data);
  }

  handleStorageSaveEnd(event) {
    console.log('💾 Storage saved:', event.data);
    this.callListeners('storageSaveEnd', event.data);
  }

  handleStorageSaveError(event) {
    console.error('❌ Storage save error:', event.data);
    this.callListeners('storageSaveError', event.data);
  }

  handleCameraPermissionRequested(event) {
    console.log('📸 Camera permission requested:', event.data);
    this.callListeners('cameraPermissionRequested', event.data);
  }

  handleCameraPermissionGranted(event) {
    console.log('✅ Camera permission granted:', event.data);
    this.callListeners('cameraPermissionGranted', event.data);
  }

  handleCameraPermissionDenied(event) {
    console.log('❌ Camera permission denied:', event.data);
    this.callListeners('cameraPermissionDenied', event.data);
  }

  handleCameraCaptureStart(event) {
    console.log('📸 Camera capture started:', event.data);
    this.callListeners('cameraCaptureStart', event.data);
  }

  handleCameraCaptureSuccess(event) {
    console.log('✅ Camera captured successfully:', event.data);
    this.callListeners('cameraCaptureSuccess', event.data);
  }

  handleCameraCaptureError(event) {
    console.error('❌ Camera capture error:', event.data);
    this.callListeners('cameraCaptureError', event.data);
  }

  handleSyncStart(event) {
    console.log('☁️ Sync started:', event.data);
    this.callListeners('syncStart', event.data);
  }

  handleSyncProgress(event) {
    console.log('🔄 Sync progress:', event.data);
    this.callListeners('syncProgress', event.data);
  }

  handleSyncComplete(event) {
    console.log('✅ Sync completed:', event.data);
    this.callListeners('syncComplete', event);
  }

  handleSyncError(event) {
    console.error('❌ Sync error:', event.data);
    this.callListeners('syncError', event);
  }

  handleConnectivityChange(event) {
    console.log('🌐 Connectivity changed:', event.data);
    this.callListeners('connectivityChange', event);
  }

  handleAlexRuntimeReady(event) {
    console.log('🤖 Alex runtime ready:', event.data);
    this.callListeners('alexRuntimeReady', event.data);
  }

  handleAlexModuleCall(event) {
    console.log('🤖 Alex module called:', event.data);
    this.alexCallCount++;
    this.callListeners('alexModuleCall', event);
  }

  handleAlexModuleError(event) {
    console.error('❌ Alex module error:', event.data);
    this.callListeners('alexModuleError', event);
  }

  handleAlexCameraCapture(event) {
    console.log('📸 Alex camera capture:', event.data);
    this.callListeners('alexCameraCapture', event);
  }

  handleAlexTaskCreated(event) {
    console.log('📋 Alex task created:', event.data);
    this.callListeners('alexTaskCreated', event);
  }

  handleAlexTaskUpdated(event) {
    console.log('📋 Alex task updated:', event.data);
    this.callListeners('alexTaskUpdated', event);
  }

  handleAlexTaskDeleted(event) {
    console.log('🗑️ Alex task deleted:', event.data);
    this.callListeners('alexTaskDeleted', event);
  }

  handleAlexStorageOperation(event) {
    console.log('💾 Alex storage operation:', event.data);
    this.callListeners('alexStorageOperation', event);
  }

  handleAlexSyncOperation(event) {
    console.log('☁️ Alex sync operation:', event.data);
    this.callListeners('alexSyncOperation', event);
  }

  handleGenericEvent(event) {
    console.log('ℹ️ Generic event:', event);
  }

  // ================================
  // LISTENER MANAGEMENT
  // ================================
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName).push(callback);
    console.log(`🔊 FleetboEventSystem: Listener added for ${eventName}`);
  }

  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;

    const callbacks = this.listeners.get(eventName);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
      console.log(`🔊 FleetboEventSystem: Listener removed for ${eventName}`);
    }

    if (callbacks.length === 0) {
      this.listeners.delete(eventName);
    }
  }

  callListeners(eventName, data) {
    const callbacks = this.listeners.get(eventName);
    if (!callbacks) return;

    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`❌ FleetboEventSystem: Listener error for ${eventName}:`, error);
      }
    });
  }

  // ================================
  // UTILITY METHODS
  // ================================
  clearEventHistory() {
    this.eventHistory = [];
    console.log('🗑️ FleetboEventSystem: Event history cleared');
  }

  getEventHistory(limit = 50) {
    return this.eventHistory.slice(0, limit);
  }

  getEventQueue() {
    return [...this.eventQueue];
  }

  getListeners() {
    const listeners = {};
    for (const [event, callbacks] of this.listeners) {
      listeners[event] = callbacks.length;
    }
    return listeners;
  }

  clearEventQueue() {
    this.eventQueue = [];
    console.log('🗑️ FleetboEventSystem: Event queue cleared');
  }

  getStats() {
    return {
      total: this.eventHistory.length,
      queued: this.eventQueue.length,
      processing: this.isProcessing,
      listeners: Object.fromEntries(this.listeners.entries()).reduce((acc, [event, callbacks]) => ({ ...acc, [event]: callbacks.length }), {}),
      fleetboAlexConnected: this.fleetboAlexConnected,
      alexCallCount: this.alexCallCount,
      eventHistorySize: this.eventHistory.length
    };
  }

  exportEventSummary() {
    const summary = {
      total: this.eventHistory.length,
      queued: this.eventQueue.length,
      processing: this.isProcessing,
      listeners: Object.fromEntries(this.listeners.entries()).reduce((acc, [event, callbacks]) => ({ ...acc, [event]: callbacks.length }), {}),
      fleetboAlexConnected: this.fleetboAlexConnected,
      alexCallCount: this.alexCallCount,
      lastAlexCall: this.alexCallCount > 0 ? this.eventHistory.filter(e => e.name.includes('alexModuleCall')).slice(-1)[0] : null
    };

    try {
      if (typeof Fleetbo !== 'undefined') {
        Fleetbo.storage.save('fleetbo_event_summary', JSON.stringify(summary));
        console.log('📊 FleetboEventSystem: Event summary exported to Fleetbo storage');
      }
    } catch (error) {
      console.log('⚠ FleetboEventSystem: Could not export summary:', error.message);
    }

    return summary;
  }

  getAlexStats() {
    return {
      connected: this.fleetboAlexConnected,
      totalCalls: this.alexCallCount,
      lastCall: this.alexCallCount > 0 ? this.eventHistory.filter(e => e.name.includes('alexModuleCall')).slice(-1)[0] : null
    };
  }

  setupFallbackEventSystem() {
    console.log('🔄 FleetboEventSystem: Setting up fallback event system');
    this.emitEvent('fallbackMode', { message: 'Fleetbo not available, using fallback system' });
  }
}

// Export singleton instance
export default new FleetboEventSystem();
// FleetboManager.js - Complete Fleetbo Navigation Management System with Event Integration
// This replaces all broken navigation with proper Fleetbo Alex architecture

import FleetboEventSystem from './FleetboEventSystem.js';
import { NavigationHelper } from './NavigationHelper.js';

export class FleetboManager {
  constructor() {
    this.isReady = false;
    this.currentRoute = null;
    this.taskStorage = [];
    this.cameraPhoto = null;
    this.eventSystem = new FleetboEventSystem();
    
    this.init();
  }

  async init() {
    console.log('🚀 FleetboManager: Initializing Fleetbo Runtime with Event System...');
    
    try {
      // Initialize Fleetbo runtime
      if (typeof Fleetbo !== 'undefined') {
        await this.setupFleetbo();
        this.setupFleetboEvents();
        this.setupAppEvents();
        this.isReady = true;
        console.log('✅ FleetboManager: Fleetbo Runtime Ready with Events');
      } else {
        console.log('⚠️ FleetboManager: Fleetbo not available, using fallback');
        this.setupFallback();
      }
    } catch (error) {
      console.error('❌ FleetboManager: Initialization failed:', error);
      this.setupFallback();
    }
  }

  async setupFleetbo() {
    // Signal page ready
    Fleetbo.onWebPageReady();
    
    // Set up storage monitoring
    await this.loadTasksFromStorage();
    
    // Set up camera
    await this.setupCamera();
    
    console.log('✅ FleetboManager: Fleetbo setup complete');
  }

  setupFallback() {
    // Fallback for development/testing
    window.FleetboManager = this;
    console.log('🔄 FleetboManager: Fallback mode activated');
  }

  setupFleetboEvents() {
    console.log('🔊 FleetboManager: Setting up Fleetbo event listeners...');
    
    // Listen for connectivity changes
    try {
      Fleetbo.on('CONNECTIVITY_CHANGE', (data) => {
        this.eventSystem.emitEvent('connectivityChange', data);
        if (data.isOnline) {
          this.syncWithCloud();
        }
      });
    } catch (error) {
      console.log('ℹ️ FleetboManager: Connectivity monitoring not available');
    }

    // Listen for navigation events
    try {
      Fleetbo.on('NAVIGATION_CHANGE', (data) => {
        this.eventSystem.emitEvent('navigationChange', {
          from: this.currentRoute,
          to: data.route,
          timestamp: new Date().toISOString()
        });
        this.currentRoute = data.route;
      });
    } catch (error) {
      console.log('ℹ️ FleetboManager: Navigation monitoring not available');
    }

    // Listen for storage events
    try {
      Fleetbo.on('STORAGE_SAVE_START', (data) => {
        this.eventSystem.emitEvent('storageSaveStart', data);
      });
      
      Fleetbo.on('STORAGE_SAVE_END', (data) => {
        this.eventSystem.emitEvent('storageSaveEnd', data);
      });
      
      Fleetbo.on('STORAGE_SAVE_ERROR', (data) => {
        this.eventSystem.emitEvent('storageSaveError', data);
      });
    } catch (error) {
      console.log('ℹ️ FleetboManager: Storage monitoring not available');
    }

    // Listen for camera events
    try {
      Fleetbo.on('CAMERA_PERMISSION_REQUESTED', (data) => {
        this.eventSystem.emitEvent('cameraPermissionRequested', data);
      });
      
      Fleetbo.on('CAMERA_PERMISSION_GRANTED', (data) => {
        this.eventSystem.emitEvent('cameraPermissionGranted', data);
      });
      
      Fleetbo.on('CAMERA_PERMISSION_DENIED', (data) => {
        this.eventSystem.emitEvent('cameraPermissionDenied', data);
      });
      
      Fleetbo.on('CAMERA_CAPTURE_START', (data) => {
        this.eventSystem.emitEvent('cameraCaptureStart', data);
      });
      
      Fleetbo.on('CAMERA_CAPTURE_SUCCESS', (data) => {
        this.eventSystem.emitEvent('cameraCaptureSuccess', data);
        this.cameraPhoto = data; // Store captured photo
      });
      
      Fleetbo.on('CAMERA_CAPTURE_ERROR', (data) => {
        this.eventSystem.emitEvent('cameraCaptureError', data);
      });
    } catch (error) {
      console.log('ℹ️ FleetboManager: Camera monitoring not available');
    }

    // Listen for sync events
    try {
      Fleetbo.on('SYNC_START', (data) => {
        this.eventSystem.emitEvent('syncStart', data);
      });
      
      Fleetbo.on('SYNC_PROGRESS', (data) => {
        this.eventSystem.emitEvent('syncProgress', data);
      });
      
      Fleetbo.on('SYNC_COMPLETE', (data) => {
        this.eventSystem.emitEvent('syncComplete', data);
      });
      
      Fleetbo.on('SYNC_ERROR', (data) => {
        this.eventSystem.emitEvent('syncError', data);
      });
    } catch (error) {
      console.log('ℹ️ FleetboManager: Sync monitoring not available');
    }
  }

  setupAppEvents() {
    console.log('🔊 FleetboManager: Setting up application event system...');
    
    // Set up custom event listeners for app-wide communication
    this.eventSystem.onAppEvent('taskCreated', (task) => {
      console.log('🔊 FleetboManager: Task created event:', task);
    });

    this.eventSystem.onAppEvent('taskUpdated', (task) => {
      console.log('🔊 FleetboManager: Task updated event:', task);
    });

    this.eventSystem.onAppEvent('taskDeleted', (taskId) => {
      console.log('🔊 FleetboManager: Task deleted event:', taskId);
    });

    this.eventSystem.onAppEvent('navigationRequested', (data) => {
      console.log('🔊 FleetboManager: Navigation requested:', data);
      this.eventSystem.emitEvent('navigationStart', data);
    });

    this.eventSystem.onAppEvent('error', (error) => {
      console.error('🔊 FleetboManager: App error event:', error);
      this.eventSystem.emitEvent('appError', error);
    });
  }

  // ================================
  // NAVIGATION METHODS
  // ================================
  
  async goToPage(pageName, params = null) {
    console.log(`🧭 FleetboManager: Navigating to ${pageName}`, params);
    
    // Emit navigation start event
    this.eventSystem.emitEvent('navigationStart', {
      from: this.currentRoute,
      to: pageName,
      timestamp: new Date().toISOString()
    });
    
    try {
      this.currentRoute = pageName;
      
      let result;
      if (params) {
        // Navigate with parameters
        result = await Fleetbo.openPageId(pageName, params.id || params);
      } else {
        // Simple navigation
        result = await Fleetbo.openPage(pageName);
      }
      
      // Emit navigation end event
      this.eventSystem.emitEvent('navigationEnd', {
        from: this.currentRoute,
        to: pageName,
        result,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ FleetboManager: Successfully navigated to ${pageName}`);
      return true;
    } catch (error) {
      // Emit navigation error event
      this.eventSystem.emitEvent('navigationError', {
        from: this.currentRoute,
        to: pageName,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.error(`❌ FleetboManager: Failed to navigate to ${pageName}:`, error);
      this.showError('Navigation Error', `Unable to open ${pageName}. Please try again.`);
      return false;
    }
  }

  async goToTaskList() {
    return await this.goToPage('tasklist');
  }

  async goToTaskCreate() {
    return await this.goToPage('taskcreate');
  }

  async goToTaskDetail(taskId) {
    return await this.goToPageId('taskdetail', taskId);
  }

  async goToProfile() {
    return await this.goToPage('profile');
  }

  async goToHome() {
    console.log('🏠 FleetboManager: Going home with stack reset');
    
    try {
      this.currentRoute = 'Home';
      await Fleetbo.toHome();
      console.log('✅ FleetboManager: Successfully returned to home');
      return true;
    } catch (error) {
      console.error('❌ FleetboManager: Failed to go home:', error);
      this.showError('Navigation Error', 'Unable to navigate to home. Please try again.');
      return false;
    }
  }

  async goBack() {
    console.log('⬅️ FleetboManager: Going back');
    
    try {
      await Fleetbo.back();
      console.log('✅ FleetboManager: Successfully went back');
      return true;
    } catch (error) {
      console.error('❌ FleetboManager: Failed to go back:', error);
      this.showError('Navigation Error', 'Unable to go back. Please try again.');
      return false;
    }
  }

  // ================================
  // TASK MANAGEMENT
  // ================================
  
  async saveTask(taskData) {
    console.log('💾 FleetboManager: Saving task:', taskData);
    
    // Emit storage save start event
    this.eventSystem.emitEvent('storageSaveStart', {
      operation: 'saveTask',
      taskData,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Generate unique ID
      const task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to local storage
      this.taskStorage.push(task);
      await this.saveTasksToStorage();
      
      // Save to cloud if online
      if (this.isOnline()) {
        if (task.photoUri) {
          await Fleetbo.addWithLastSelectedImage('Tasks', 'UserTasks', task);
        } else {
          await Fleetbo.addWithUserId('Tasks', 'UserTasks', task);
        }
      }
      
      // Emit task created event
      this.eventSystem.emitAppEvent('taskCreated', task);
      
      // Emit storage save end event
      this.eventSystem.emitEvent('storageSaveEnd', {
        operation: 'saveTask',
        taskId: task.id,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ FleetboManager: Task saved successfully');
      return task;
    } catch (error) {
      // Emit storage save error event
      this.eventSystem.emitEvent('storageSaveError', {
        operation: 'saveTask',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.error('❌ FleetboManager: Failed to save task:', error);
      this.showError('Save Error', 'Failed to save task. Please try again.');
      return null;
    }
  }

  async loadTasks() {
    console.log('📂 FleetboManager: Loading tasks...');
    
    try {
      await this.loadTasksFromStorage();
      
      // Sync with cloud if online
      if (this.isOnline()) {
        const cloudTasks = await Fleetbo.getDocsU('Tasks', 'UserTasks');
        if (cloudTasks && cloudTasks.length > 0) {
          this.taskStorage = cloudTasks;
          await this.saveTasksToStorage();
        }
      }
      
      console.log(`✅ FleetboManager: Loaded ${this.taskStorage.length} tasks`);
      return this.taskStorage;
    } catch (error) {
      console.error('❌ FleetboManager: Failed to load tasks:', error);
      return [];
    }
  }

  async deleteTask(taskId) {
    console.log('🗑️ FleetboManager: Deleting task:', taskId);
    
    try {
      // Remove from local storage
      this.taskStorage = this.taskStorage.filter(task => task.id !== taskId);
      await this.saveTasksToStorage();
      
      // Delete from cloud
      if (this.isOnline()) {
        await Fleetbo.delete('Tasks', 'UserTasks', taskId);
      }
      
      console.log('✅ FleetboManager: Task deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ FleetboManager: Failed to delete task:', error);
      this.showError('Delete Error', 'Failed to delete task. Please try again.');
      return false;
    }
  }

  async loadTasksFromStorage() {
    try {
      const tasksJson = await Fleetbo.storage.read('snap_tasks') || '[]';
      this.taskStorage = JSON.parse(tasksJson);
    } catch (error) {
      console.error('❌ FleetboManager: Failed to load from storage:', error);
      this.taskStorage = [];
    }
  }

  async saveTasksToStorage() {
    try {
      await Fleetbo.storage.save('snap_tasks', JSON.stringify(this.taskStorage));
    } catch (error) {
      console.error('❌ FleetboManager: Failed to save to storage:', error);
    }
  }

  // ================================
  // CAMERA OPERATIONS
  // ================================
  
  async setupCamera() {
    console.log('📸 FleetboManager: Setting up camera...');
    try {
      const hasPermission = await NavigationHelper.requestCameraPermission();
      console.log('📸 FleetboManager: Camera permission status:', hasPermission);
    } catch (error) {
      console.log('ℹ️ FleetboManager: Camera permission check not available');
    }
  }

  async requestCameraPermission() {
    console.log('🔐 FleetboManager: Requesting camera permission...');
    try {
      const hasPermission = await NavigationHelper.requestCameraPermission();
      console.log('📸 FleetboManager: Camera permission granted:', hasPermission);
      return hasPermission;
    } catch (error) {
      console.error('❌ FleetboManager: Permission request failed:', error);
      this.showError('Permission Error', 'Camera permission is required to take photos.');
      return false;
    }
  }

  async capturePhoto() {
    console.log('📸 FleetboManager: Starting photo capture...');
    this.eventSystem.emitEvent('cameraCaptureStart', {
      timestamp: new Date().toISOString()
    });
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        this.eventSystem.emitEvent('cameraCaptureError', {
          error: 'Camera permission denied',
          timestamp: new Date().toISOString()
        });
        return null;
      }
      const result = await NavigationHelper.takePhoto();
      let photoData = null;
      if (result) {
        let photoUri = null;
        if (typeof result === 'string') {
          try {
            const parsed = JSON.parse(result);
            photoUri = parsed.url || parsed.uri || result;
          } catch {
            photoUri = result;
          }
        } else if (result.url) {
          photoUri = result.url;
        } else if (result.uri) {
          photoUri = result.uri;
        }
        if (photoUri) {
          photoData = { uri: photoUri };
          this.cameraPhoto = photoData;
          if (typeof Fleetbo !== 'undefined' && Fleetbo.storage && Fleetbo.storage.save) {
            await Fleetbo.storage.save('last_photo', JSON.stringify(photoData));
          }
          this.eventSystem.emitEvent('cameraCaptureSuccess', {
            photoData,
            timestamp: new Date().toISOString()
          });
          return photoData;
        }
      }
      this.eventSystem.emitEvent('cameraCaptureError', {
        error: 'Photo capture returned no data',
        timestamp: new Date().toISOString()
      });
      this.showError('Camera Error', 'Failed to capture photo. Please try again.');
      return null;
    } catch (error) {
      this.eventSystem.emitEvent('cameraCaptureError', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('❌ FleetboManager: Photo capture error:', error);
      this.showError('Camera Error', 'Unable to capture photo. Please try again.');
      return null;
    }
  }

  async getLastPhoto() {
    try {
      const photoJson = await Fleetbo.storage.read('last_photo');
      if (photoJson) {
        const photo = JSON.parse(photoJson);
        console.log('📸 FleetboManager: Retrieved last photo:', photo);
        return photo;
      }
    } catch (error) {
      console.error('❌ FleetboManager: Failed to get last photo:', error);
    }
    return null;
  }

  // ================================
  // UTILITY METHODS
  // ================================
  
  isOnline() {
    try {
      // Check Fleetbo connectivity status
      return true; // Assume online for development
    } catch (error) {
      return navigator.onLine || true;
    }
  }

  async syncWithCloud() {
    console.log('☁️ FleetboManager: Syncing with cloud...');
    
    try {
      if (this.isOnline()) {
        await this.loadTasks();
        console.log('✅ FleetboManager: Cloud sync complete');
      }
    } catch (error) {
      console.error('❌ FleetboManager: Cloud sync failed:', error);
    }
  }

  showError(title, message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed-top alert alert-warning alert-dismissible fade show m-3 mx-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="spinner-border spinner-border-sm me-3"></div>
        <div>
          <strong>${title}</strong><br>
          <small>${message}</small>
        </div>
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  showSuccess(title, message) {
    // Create success notification
    const toast = document.createElement('div');
    toast.className = 'fixed-top alert alert-success alert-dismissible fade show m-3 mx-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="me-3">
          <i class="fas fa-check-circle fa-lg"></i>
        </div>
        <div>
          <strong>${title}</strong><br>
          <small>${message}</small>
        </div>
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // ================================
  // FLEETBO ALEX INTEGRATION
  // ================================
  
  async callFleetboAlex(module, action, params = {}) {
    console.log(`🤖 FleetboManager: Calling Fleetbo Alex - ${module}.${action}`, params);
    
    try {
      const result = await Fleetbo.exec(module, action, params);
      console.log(`✅ FleetboManager: Alex call successful:`, result);
      return result;
    } catch (error) {
      console.error(`❌ FleetboManager: Alex call failed:`, error);
      this.showError('System Error', 'Operation failed. Please try again.');
      return null;
    }
  }

  // ================================
  // PUBLIC API
  // ================================
  
  async createTask(title, description = '', photoUri = null) {
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      photoUri,
      completed: false,
      priority: 'normal',
      tags: []
    };
    
    const task = await this.saveTask(taskData);
    
    if (task) {
      this.showSuccess('Task Created', 'Task created successfully!');
      await this.goToTaskList();
    }
    
    return task;
  }

  async updateTask(taskId, updates) {
    const taskIndex = this.taskStorage.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const updatedTask = {
        ...this.taskStorage[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      this.taskStorage[taskIndex] = updatedTask;
      await this.saveTasksToStorage();
      
      // Update in cloud
      if (this.isOnline()) {
        await Fleetbo.update('Tasks', 'UserTasks', taskId, updatedTask);
      }
      
      console.log('✅ FleetboManager: Task updated successfully');
      this.showSuccess('Task Updated', 'Task updated successfully!');
      
      return updatedTask;
    }
    
    return null;
  }

  getTasks() {
    return this.taskStorage;
  }

  getTask(taskId) {
    return this.taskStorage.find(task => task.id === taskId);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  async resetToHome() {
    await this.goToHome();
  }
}

// Export singleton instance
export default new FleetboManager();
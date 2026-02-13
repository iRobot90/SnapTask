// NavigationHelper.js - Complete Fleetbo navigation, storage, camera & event helper
// Supports Fleetbo native runtime with web fallbacks

const createEventEmitter = () => {
  const listeners = {};

  return {
    on(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
      return () => this.off(event, callback);
    },
    off(event, callback) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    },
    emit(event, data) {
      if (!listeners[event]) return;
      listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Event handler error for ${event}:`, e);
        }
      });
    },
    once(event, callback) {
      const wrapper = (data) => {
        this.off(event, wrapper);
        callback(data);
      };
      return this.on(event, wrapper);
    }
  };
};

const eventBus = createEventEmitter();

const isFleetboAvailable = () => {
  return typeof Fleetbo !== 'undefined' && Fleetbo !== null && typeof Fleetbo.exec === 'function';
};

const executeFleetbo = async (module, action, params = {}) => {
  if (!isFleetboAvailable() || !Fleetbo.exec) {
    throw new Error('Fleetbo runtime not available');
  }
  try {
    return await Fleetbo.exec(module, action, params);
  } catch (e) {
    const errorMsg = String(e);
    if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('not available')) {
      throw new Error(`${module} ${action} not found`);
    }
    throw e;
  }
};

const readStorage = async (key) => {
  try {
    if (isFleetboAvailable() && Fleetbo.storage && Fleetbo.storage.read) {
      return await Fleetbo.storage.read(key);
    }
  } catch (e) {
    console.warn('Fleetbo storage read failed, using localStorage:', e);
  }
  return localStorage.getItem(key);
};

const saveStorage = async (key, value) => {
  try {
    if (isFleetboAvailable() && Fleetbo.storage && Fleetbo.storage.save) {
      return await Fleetbo.storage.save(key, value);
    }
  } catch (e) {
    console.warn('Fleetbo storage save failed, using localStorage:', e);
  }
  localStorage.setItem(key, value);
  return true;
};

const clearStorage = async (key) => {
  try {
    if (isFleetboAvailable() && Fleetbo.storage && Fleetbo.storage.delete) {
      return await Fleetbo.storage.delete(key);
    }
  } catch (e) {
    console.warn('Fleetbo storage delete failed, using localStorage:', e);
  }
  localStorage.removeItem(key);
  return true;
};

const NavigationHelper = {
  eventBus,
  clearStorage,
  executeFleetbo,
  isFleetboAvailable,

  executeFleetboWithTimeout: async (module, action, params = {}, timeoutMs = 10000) => {
    if (!isFleetboAvailable()) {
      throw new Error('Fleetbo not available');
    }

    const fleetboPromise = executeFleetbo(module, action, params);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${module} ${action} timeout`)), timeoutMs)
    );

    return Promise.race([fleetboPromise, timeoutPromise]);
  },

  on(event, callback) {
    return eventBus.on(event, callback);
  },

  off(event, callback) {
    eventBus.off(event, callback);
  },

  emit(event, data) {
    eventBus.emit(event, data);
  },

  isFleetbo: isFleetboAvailable,

  // ================================
  // NAVIGATION - Fleetbo with React Router fallback
  // ================================

  async goToHome() {
    console.log('NavigationHelper: goToHome');
    eventBus.emit('NAVIGATION', { to: 'home' });

    if (isFleetboAvailable() && Fleetbo.toHome) {
      try {
        await Fleetbo.toHome();
        return true;
      } catch (e) {
        console.warn('Fleetbo.toHome failed:', e);
      }
    }

    if (isFleetboAvailable() && Fleetbo.openPage) {
      try {
        await Fleetbo.openPage('home');
        return true;
      } catch (e) {
        console.warn('Fleetbo.openPage(home) failed:', e);
      }
    }

    window.location.hash = '#/home';
    return true;
  },

  async goToTaskList() {
    console.log('NavigationHelper: goToTaskList');
    eventBus.emit('NAVIGATION', { to: 'tasklist' });

    if (isFleetboAvailable() && Fleetbo.openPage) {
      try {
        await Fleetbo.openPage('tasklist');
        return true;
      } catch (e) {
        console.warn('Fleetbo.openPage(tasklist) failed:', e);
      }
    }

    window.location.hash = '#/tasklist';
    return true;
  },

  async goToTaskCreate() {
    console.log('NavigationHelper: goToTaskCreate');
    eventBus.emit('NAVIGATION', { to: 'taskcreate' });

    if (isFleetboAvailable() && Fleetbo.openPage) {
      try {
        await Fleetbo.openPage('taskcreate');
        return true;
      } catch (e) {
        console.warn('Fleetbo.openPage(taskcreate) failed:', e);
      }
    }

    window.location.hash = '#/taskcreate';
    return true;
  },

  async goToNewTask() {
    return this.goToTaskCreate();
  },

  async goToTaskDetail(taskId) {
    console.log('NavigationHelper: goToTaskDetail', taskId);

    if (!taskId) {
      eventBus.emit('ERROR', { code: 'INVALID_ID', message: 'Task ID is required' });
      return false;
    }

    eventBus.emit('NAVIGATION', { to: 'taskdetail', taskId });

    if (isFleetboAvailable() && Fleetbo.openPageId) {
      try {
        await Fleetbo.openPageId('taskdetail', taskId);
        return true;
      } catch (e) {
        console.warn('Fleetbo.openPageId failed:', e);
      }
    }

    window.location.hash = `#/taskdetail?id=${taskId}`;
    return true;
  },

  async goToProfile() {
    console.log('NavigationHelper: goToProfile');
    eventBus.emit('NAVIGATION', { to: 'profile' });

    if (isFleetboAvailable() && Fleetbo.openPage) {
      try {
        await Fleetbo.openPage('profile');
        return true;
      } catch (e) {
        console.warn('Fleetbo.openPage(profile) failed:', e);
      }
    }

    window.location.hash = '#/profile';
    return true;
  },

  async goBack() {
    console.log('NavigationHelper: goBack');
    eventBus.emit('NAVIGATION', { action: 'back' });

    if (isFleetboAvailable() && Fleetbo.back) {
      try {
        await Fleetbo.back();
        return true;
      } catch (e) {
        console.warn('Fleetbo.back failed:', e);
      }
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goToHome();
    }
    return true;
  },

  async handleBackButton() {
    return this.goBack();
  },

  // ================================
  // TASK STORAGE
  // ================================

  async loadTasks() {
    try {
      const stored = await readStorage('snap_tasks');
      const tasks = stored ? JSON.parse(stored) : [];
      eventBus.emit('TASKS_LOADED', { count: tasks.length });
      return tasks;
    } catch (error) {
      eventBus.emit('ERROR', { code: 'LOAD_ERROR', message: error.message });
      console.error('Load tasks error:', error);
      return [];
    }
  },

  async saveTask(taskData) {
    try {
      const existingRaw = await readStorage('snap_tasks');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const tasks = [...existing, taskData];
      await saveStorage('snap_tasks', JSON.stringify(tasks));
      eventBus.emit('TASK_CREATED', { taskId: taskData.id });
      eventBus.emit('DATA_CHANGED', { type: 'task', action: 'create' });
      return true;
    } catch (error) {
      eventBus.emit('ERROR', { code: 'SAVE_ERROR', message: error.message });
      console.error('Save task error:', error);
      throw error;
    }
  },

  async updateTask(taskId, updates) {
    try {
      const existingRaw = await readStorage('snap_tasks');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const taskIndex = existing.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      existing[taskIndex] = { ...existing[taskIndex], ...updates, updatedAt: new Date().toISOString() };
      await saveStorage('snap_tasks', JSON.stringify(existing));
      eventBus.emit('TASK_UPDATED', { taskId });
      eventBus.emit('DATA_CHANGED', { type: 'task', action: 'update' });
      return existing[taskIndex];
    } catch (error) {
      eventBus.emit('ERROR', { code: 'UPDATE_ERROR', message: error.message });
      console.error('Update task error:', error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    console.log('NavigationHelper: deleteTask called for:', taskId, 'type:', typeof taskId);
    try {
      const existingRaw = await readStorage('snap_tasks');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      console.log('NavigationHelper: Current tasks before delete:', existing.length);
      console.log('NavigationHelper: Task IDs:', existing.map(t => ({ id: t.id, type: typeof t.id })));

      const taskIdStr = String(taskId);
      const updated = existing.filter((t) => String(t.id) === taskIdStr);
      console.log('NavigationHelper: Tasks after filter:', updated.length);

      if (updated.length === existing.length) {
        console.warn('NavigationHelper: Task not found with id:', taskId);
      }

      await saveStorage('snap_tasks', JSON.stringify(updated));

      if (isFleetboAvailable()) {
        try {
          await Fleetbo.delete('Tasks', 'UserTasks', taskId);
          console.log('NavigationHelper: Cloud delete successful');
        } catch (cloudErr) {
          console.warn('NavigationHelper: Cloud delete failed:', cloudErr);
        }
      }

      eventBus.emit('TASK_DELETED', { taskId });
      eventBus.emit('DATA_CHANGED', { type: 'task', action: 'delete' });

      console.log('NavigationHelper: Task deleted successfully');
      return updated.length < existing.length;
    } catch (error) {
      eventBus.emit('ERROR', { code: 'DELETE_ERROR', message: error.message });
      console.error('NavigationHelper: Delete task error:', error);
      throw error;
    }
  },

  async toggleTaskComplete(taskId) {
    try {
      const existingRaw = await readStorage('snap_tasks');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const taskIndex = existing.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      existing[taskIndex].completed = !existing[taskIndex].completed;
      existing[taskIndex].updatedAt = new Date().toISOString();

      await saveStorage('snap_tasks', JSON.stringify(existing));

      const completed = existing[taskIndex].completed;
      eventBus.emit('TASK_COMPLETED', { taskId, completed });
      eventBus.emit('DATA_CHANGED', { type: 'task', action: 'toggle' });

      return existing[taskIndex];
    } catch (error) {
      eventBus.emit('ERROR', { code: 'TOGGLE_ERROR', message: error.message });
      console.error('Toggle task error:', error);
      throw error;
    }
  },

  // ================================
  // CAMERA - Native with web fallback
  // Uses PermissionModule (FleetboModule); result comes via CAMERA_PERMISSION_RESULT / PERMISSION_RESULT events.
  // ================================

  async requestCameraPermission() {
    console.log('NavigationHelper: requestCameraPermission');

    if (!isFleetboAvailable()) {
      return this.requestWebCameraPermission();
    }

    try {
      const result = await this._requestPermissionViaFleetbo('camera');
      console.log('NavigationHelper: Permission result:', result);
      return !!result;
    } catch (e) {
      console.warn('PermissionModule request failed:', e);
      return false;
    }
  },

  async takePhoto() {
    console.log('NavigationHelper: takePhoto called');

    const openCameraWebFallback = () => {
      console.log('NavigationHelper: Opening camera (web fallback)...');

      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('capture', 'environment');
        input.style.display = 'none';
        document.body.appendChild(input);

        const handleFile = (e) => {
          const file = e.target.files[0];
          document.body.removeChild(input);

          if (!file) {
            console.log('NavigationHelper: No file selected (web fallback)');
            resolve(null);
            return;
          }

          console.log('NavigationHelper: File selected (web fallback):', file.name, file.type, file.size);

          const reader = new FileReader();
          reader.onload = (event) => {
            console.log('NavigationHelper: Photo read successfully (web fallback)');
            eventBus.emit('PHOTO_CAPTURED', { uri: event.target.result });
            resolve({ uri: event.target.result });
          };
          reader.onerror = () => {
            console.error('NavigationHelper: File read error (web fallback)');
            resolve(null);
          };
          reader.readAsDataURL(file);
        };

        input.onchange = handleFile;

        input.onclick = (e) => {
          console.log('NavigationHelper: Clicking input to open camera (web fallback)...');
        };

        try {
          input.click();
          console.log('NavigationHelper: Camera input clicked (web fallback)');
        } catch (err) {
          console.error('NavigationHelper: Failed to click input (web fallback):', err);
          document.body.removeChild(input);
          resolve(null);
        }
      });
    };

    if (isFleetboAvailable()) {
      console.log('NavigationHelper: Attempting to call native StockCamera via event flow.');

      return new Promise((resolve, reject) => {
        let settled = false;
        const timeoutMs = 60000; // 60s timeout for camera capture

        const cleanup = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try {
            Fleetbo.off('CAMERA_CAPTURE_SUCCESS', handleSuccess);
            Fleetbo.off('CAMERA_CAPTURE_ERROR', handleError);
          } catch (_) { }
        };

        const handleSuccess = (data) => {
          console.log('NavigationHelper: Received CAMERA_CAPTURE_SUCCESS', data);
          cleanup();

          let uri = null;
          if (data) {
            if (typeof data === 'string') uri = data;
            else if (data.uri) uri = data.uri;
            else if (data.url) uri = data.url;
            else if (data.data && data.data.uri) uri = data.data.uri;
          }

          if (uri) {
            eventBus.emit('PHOTO_CAPTURED', { uri });
            resolve({ uri });
          } else {
            console.warn('NavigationHelper: Event data missing URI', data);
            // Even if native succeeded but gave no URI, we might want to resolve null or fallback?
            // Let's resolve null to indicate "done but no photo" or let caller handle it.
            resolve(null);
          }
        };

        const handleError = (data) => {
          console.error('NavigationHelper: Received CAMERA_CAPTURE_ERROR', data);
          cleanup();
          // Fallback to web? or reject?
          // If native explicitly errors, maybe we should try web fallback?
          openCameraWebFallback().then(resolve).catch(reject);
        };

        const timer = setTimeout(() => {
          console.warn('NavigationHelper: Camera capture timed out');
          cleanup();
          openCameraWebFallback().then(resolve).catch(reject);
        }, timeoutMs);

        try {
          Fleetbo.on('CAMERA_CAPTURE_SUCCESS', handleSuccess);
          Fleetbo.on('CAMERA_CAPTURE_ERROR', handleError);

          // Call the native module
          Fleetbo.exec('StockCamera', 'capture', {})
            .catch(err => {
              console.error('NavigationHelper: StockCamera.capture exec failed', err);
              // If immediate exec fail, cleanup and try web
              cleanup();
              openCameraWebFallback().then(resolve).catch(reject);
            });

        } catch (err) {
          console.error('NavigationHelper: Failed to setup listeners or call exec', err);
          cleanup();
          openCameraWebFallback().then(resolve).catch(reject);
        }
      });
    } else {
      console.log('NavigationHelper: Fleetbo not available, using browser camera (web fallback).');
      return openCameraWebFallback();
    }
  },

  /**
   * Request permission via Fleetbo PermissionModule. PermissionModule sends status "pending"
   * then emits CAMERA_PERMISSION_RESULT / GALLERY_PERMISSION_RESULT (and PERMISSION_RESULT)
   * when the user grants/denies. This returns a Promise that resolves when that event fires.
   */
  _requestPermissionViaFleetbo(permissionType) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (granted) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try {
          Fleetbo.off(eventName, handleResult);
          Fleetbo.off('PERMISSION_RESULT', handleGeneric);
          Fleetbo.off('CAMERA_PERMISSION_GRANTED', handleGranted);
          Fleetbo.off('CAMERA_PERMISSION_DENIED', handleDenied);
        } catch (_) { }
        resolve(!!granted);
      };
      const fail = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try {
          Fleetbo.off(eventName, handleResult);
          Fleetbo.off('PERMISSION_RESULT', handleGeneric);
          Fleetbo.off('CAMERA_PERMISSION_GRANTED', handleGranted);
          Fleetbo.off('CAMERA_PERMISSION_DENIED', handleDenied);
        } catch (_) { }
        reject(err);
      };

      const timeoutMs = 60000;
      const eventName = permissionType === 'camera' ? 'CAMERA_PERMISSION_RESULT' : 'GALLERY_PERMISSION_RESULT';

      const handleResult = (data) => {
        const granted = data && (data.granted === true || data.granted === 'true');
        finish(granted);
      };

      const handleGranted = (data) => {
        finish(true);
      };

      const handleDenied = (data) => {
        finish(false);
      };

      const handleGeneric = (data) => {
        if (data && data.permission === permissionType) {
          handleResult(data);
        }
      };

      const timer = setTimeout(() => fail(new Error('Permission request timed out')), timeoutMs);

      try {
        Fleetbo.on(eventName, handleResult);
        Fleetbo.on('PERMISSION_RESULT', handleGeneric);
        Fleetbo.on('CAMERA_PERMISSION_GRANTED', handleGranted);
        Fleetbo.on('CAMERA_PERMISSION_DENIED', handleDenied);

        executeFleetbo('StockCamera', 'requestPermission', { type: permissionType })
          .then((res) => {
            if (res && (res.granted === true || res.status === 'granted')) {
              finish(true);
            } else if (res && res.status === 'pending') {
              console.log('NavigationHelper: Permission request pending, waiting for user response...');
            }
          })
          .catch((err) => fail(err));
      } catch (err) {
        fail(err);
      }
    });
  },

  async requestWebCameraPermission() {
    return new Promise((resolve) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          stream.getTracks().forEach(track => track.stop());
          resolve(true);
        })
        .catch((err) => {
          console.warn('Web camera permission denied:', err);
          resolve(false);
        });
    });
  },

  async takePhotoWebFallback() {
    console.log('NavigationHelper: takePhotoWebFallback');

    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          console.log('NavigationHelper: Web photo captured');
          eventBus.emit('PHOTO_CAPTURED', { uri: event.target.result, fallback: true });
          resolve({ uri: event.target.result });
        };
        reader.onerror = () => {
          eventBus.emit('ERROR', { code: 'READ_ERROR', message: 'Failed to read image' });
          reject(new Error('Failed to read image'));
        };
        reader.readAsDataURL(file);
      };

      input.onerror = () => {
        eventBus.emit('ERROR', { code: 'CAMERA_ERROR', message: 'Failed to open camera' });
        reject(new Error('Failed to open camera'));
      };

      input.click();
    });
  },

  /**
   * Capture a photo (for CameraScreen). Requests camera permission then takes photo.
   * Callback receives uri string or null. Returns { ok } or { error } for permission/capture failure.
   */
  async captureCamera(callback) {
    if (typeof callback !== 'function') return { error: 'No callback provided' };
    try {
      const result = await this.takePhoto();
      const uri = (result && (result.uri || result.url)) || (typeof result === 'string' ? result : null);
      if (uri) {
        callback(uri);
        return { ok: true };
      }
      callback(null);
      return { error: result === null ? 'Camera permission denied' : 'No photo captured' };
    } catch (e) {
      console.warn('NavigationHelper: captureCamera failed', e);
      callback(null);
      return { error: e?.message?.includes('permission') ? 'Camera permission denied' : (e?.message || 'Capture failed') };
    }
  },

  /**
   * Save a captured photo (persist and optional callbacks). Stores as last_photo for
   * use by NewTaskScreen / task create flow, then calls onSuccess or onError.
   */
  async savePhoto(photoUri, { onSuccess, onError } = {}) {
    if (!photoUri) {
      if (onError) onError(new Error('No photo to save'));
      return;
    }
    try {
      const payload = typeof photoUri === 'string' ? { uri: photoUri } : { uri: photoUri?.uri || photoUri?.url };
      await saveStorage('last_photo', JSON.stringify(payload));
      if (typeof window !== 'undefined') window.lastCapturedPhoto = payload;
      eventBus.emit('PHOTO_SAVED', payload);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.warn('NavigationHelper: savePhoto failed', e);
      if (onError) onError(e);
    }
  },

  // ================================
  // PAGE READY
  // ================================

  signalPageReady() {
    console.log('NavigationHelper: signalPageReady');

    if (isFleetboAvailable() && Fleetbo.onWebPageReady) {
      try {
        Fleetbo.onWebPageReady();
      } catch (e) {
        console.error('signalPageReady error:', e);
      }
    }
    eventBus.emit('PAGE_READY', {});
  },

  // ================================
  // CONNECTIVITY
  // ================================

  setupConnectivityListener(callback) {
    const handler = (data) => {
      if (callback) callback(data);
      eventBus.emit('CONNECTIVITY_CHANGE', data);
    };

    if (isFleetboAvailable() && Fleetbo.on) {
      Fleetbo.on('CONNECTIVITY_CHANGE', handler);

      try {
        executeFleetbo('Connectivity', 'check', {}).catch(() => { });
      } catch (e) { }
    }

    window.addEventListener('online', () => handler({ isOnline: true }));
    window.addEventListener('offline', () => handler({ isOnline: false }));

    handler({ isOnline: navigator.onLine });

    return () => {
      if (isFleetboAvailable() && Fleetbo.off) {
        Fleetbo.off('CONNECTIVITY_CHANGE', handler);
      }
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  },

  // ================================
  // NOTIFICATIONS
  // ================================

  showToast(message, type = 'info', duration = 3000) {
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type] || colors.info};
      color: ${type === 'warning' ? '#000' : '#fff'};
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);
    eventBus.emit('TOAST_SHOWN', { message, type });

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  showSuccess(message) {
    this.showToast(message, 'success');
  },

  showError(message) {
    this.showToast(message, 'error', 4000);
  },

  showWarning(message) {
    this.showToast(message, 'warning');
  },

  showInfo(message) {
    this.showToast(message, 'info');
  }
};

export { NavigationHelper };
export default NavigationHelper;

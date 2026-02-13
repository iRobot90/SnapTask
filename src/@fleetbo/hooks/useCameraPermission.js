import { useState, useEffect, useCallback } from 'react';
import { NavigationHelper } from '../../utils/NavigationHelper';

const { eventBus, isFleetboAvailable } = NavigationHelper;

export const PERMISSION_STATES = {
  CHECKING: 'checking',
  GRANTED: 'granted',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNSUPPORTED: 'unsupported',
};

export const useCameraPermission = (options = {}) => {
  const {
    autoCheck = true,
    onGranted,
    onDenied,
  } = options;

  const [permissionState, setPermissionState] = useState(PERMISSION_STATES.CHECKING);
  const [isLoading, setIsLoading] = useState(false);

  const checkPermission = useCallback(async () => {
    setPermissionState(PERMISSION_STATES.CHECKING);
    setIsLoading(true);

    try {
      if (!isFleetboAvailable()) {
        const granted = await NavigationHelper.requestWebCameraPermission();
        setPermissionState(granted ? PERMISSION_STATES.GRANTED : PERMISSION_STATES.DENIED);
        return granted;
      }

      const granted = await NavigationHelper.requestCameraPermission();
      
      if (granted) {
        setPermissionState(PERMISSION_STATES.GRANTED);
        onGranted?.();
      } else {
        const hasFleetbo = isFleetboAvailable();
        if (!hasFleetbo) {
          setPermissionState(PERMISSION_STATES.DENIED);
        }
      }
      
      return granted;
    } catch (error) {
      console.warn('useCameraPermission: checkPermission failed:', error);
      setPermissionState(PERMISSION_STATES.DENIED);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onGranted]);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const granted = await NavigationHelper.requestCameraPermission();
      
      if (granted) {
        setPermissionState(PERMISSION_STATES.GRANTED);
        onGranted?.();
      } else {
        setPermissionState(PERMISSION_STATES.DENIED);
        onDenied?.();
      }
      
      return granted;
    } catch (error) {
      console.warn('useCameraPermission: requestPermission failed:', error);
      setPermissionState(PERMISSION_STATES.DENIED);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onGranted, onDenied]);

  const openSettings = useCallback(async () => {
    if (isFleetboAvailable()) {
      try {
        await NavigationHelper.executeFleetbo('PermissionModule', 'openSettings', {});
      } catch (error) {
        console.warn('useCameraPermission: openSettings failed:', error);
      }
    }
  }, []);

  const takePhoto = useCallback(async () => {
    if (permissionState !== PERMISSION_STATES.GRANTED) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    return new Promise((resolve) => {
      NavigationHelper.captureCamera((photoUri) => {
        resolve(photoUri);
      });
    });
  }, [permissionState, requestPermission]);

  useEffect(() => {
    if (autoCheck) {
      checkPermission();
    }
  }, [autoCheck, checkPermission]);

  useEffect(() => {
    const handlePermissionDenied = (data) => {
      setPermissionState(PERMISSION_STATES.DENIED);
      onDenied?.(data);
    };

    eventBus.on('CAMERA_PERMISSION_DENIED', handlePermissionDenied);

    return () => {
      eventBus.off('CAMERA_PERMISSION_DENIED', handlePermissionDenied);
    };
  }, [onDenied]);

  return {
    permissionState,
    isLoading,
    isGranted: permissionState === PERMISSION_STATES.GRANTED,
    isDenied: permissionState === PERMISSION_STATES.DENIED || permissionState === PERMISSION_STATES.BLOCKED,
    isChecking: permissionState === PERMISSION_STATES.CHECKING,
    isBlocked: permissionState === PERMISSION_STATES.BLOCKED,
    checkPermission,
    requestPermission,
    openSettings,
    takePhoto,
    PERMISSION_STATES,
  };
};

export default useCameraPermission;

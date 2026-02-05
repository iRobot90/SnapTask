import { useEffect } from 'react';

// This is a headless mock for a background service.
// It simulates the native module's behavior for development in VS Code.
function OfflineSyncQueue() {

  useEffect(() => {
    const MOCK_API = {
      start: () => {
        console.log('[Mock] OfflineSyncQueue worker initialized.');
      },
      queueOperation: (op) => {
        console.log('[Mock] Operation queued:', op);
        // Simulate an automatic sync attempt after a short delay
        setTimeout(() => {
          // Emit SYNCING event
          window.Fleetbo.emit('SYNC_STATUS', { state: 'SYNCING' });

          // Simulate sync result after another delay
          setTimeout(() => {
            const isSuccess = Math.random() > 0.2; // 80% success rate
            if (isSuccess) {
              console.log('[Mock] Sync successful.');
              window.Fleetbo.emit('SYNC_COMPLETED', { count: 1 });
            } else {
              console.log('[Mock] Sync failed. Will retry later.');
              window.Fleetbo.emit('SYNC_FAILED', {
                message: 'Simulated network error. Check connection.'
              });
            }
          }, 2500);
        }, 1000);
      },
    };

    // Register this mock to respond to Fleetbo.exec calls
    window.Fleetbo.registerMock('OfflineSyncQueue', MOCK_API);

    // Cleanup on component unmount
    return () => {
      window.Fleetbo.unregisterMock('OfflineSyncQueue');
    };
  }, []);

  // This component does not render any UI
  return null;
}

export default OfflineSyncQueue;

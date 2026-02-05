import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

// This is a headless mock component. It simulates the native PermissionModule for the
// VS Code Live Virtualization environment. It is not meant to be rendered directly.
// The Fleetbo virtual runtime will invoke its logic when Fleetbo.exec is called.
function PermissionModule() {
  const [showDialog, setShowDialog] = useState(false);
  const [resolver, setResolver] = useState(null);

  useEffect(() => {
    // This effect simulates the registration of the mock module's methods.
    // The virtual runtime will call these functions when it sees a matching exec call.
    window.Fleetbo.registerMock('PermissionModule', {
      request: (params) => new Promise((resolve) => {
        setResolver(() => resolve); // Store the resolve function to be called later
        setShowDialog(true);
      }),
      check: async (params) => ({ status: 'denied' }), // Default mock response
      openSettings: async () => {
        console.log("FLEETBO MOCK: Navigating to app settings.");
        return { status: 'opened' };
      }
    });

    return () => {
      window.Fleetbo.unregisterMock('PermissionModule');
    };
  }, []);

  const handleDecision = (isGranted) => {
    setShowDialog(false);
    if (resolver) {
      if (isGranted) {
        resolver({ status: 'granted' });
      } else {
        // Simulate that the denial was not permanent for the mock.
        resolver({ status: 'denied', permanentlyDenied: false });
      }
    }
    setResolver(null);
  };

  if (!showDialog) {
    return null;
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-end p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="bg-light rounded-4 p-3 w-100" style={{ maxWidth: '400px' }}>
        <div className="d-flex">
          <div className="p-2 bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <Camera size={20} />
          </div>
          <div>
            <h6 className="fw-bold mb-0">Allow "App" to access your Camera?</h6>
            <p className="text-muted small mb-0 mt-1">This allows you to take photos and scan QR codes.</p>
          </div>
        </div>
        <div className="d-grid gap-2 mt-3">
          <button className="btn btn-primary fw-bold" onClick={() => handleDecision(true)}>Allow</button>
          <button className="btn btn-secondary bg-body-secondary text-dark fw-bold" onClick={() => handleDecision(false)}>Don't Allow</button>
        </div>
      </div>
    </div>
  );
}

export default PermissionModule;
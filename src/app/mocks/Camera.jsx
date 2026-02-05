import React, { useState } from 'react';
import { PageConfig } from '@fleetbo';
import { Camera as CameraIcon, CheckCircle } from 'lucide-react';

// The Mock must have the same name as the Native Module.
function Camera() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // This mock simulates the native module's behavior.
  // It provides a high-fidelity UI and returns a predictable data structure.
  const handleMockCapture = () => {
    setIsProcessing(true);
    setCapturedImage(null);

    // Simulate network and processing delay
    setTimeout(() => {
      // In a real scenario, Fleetbo.exec would be called.
      // The native module would then emit an 'IMAGE_PROCESSED' event.
      const mockPayload = {
        fullUri: 'https://fleetbo.io/images/console/gallery/1.png',
        thumbnailUri: 'https://fleetbo.io/images/console/gallery/2.png',
      };

      // Set state to show the result in the mock UI.
      setCapturedImage(mockPayload);
      setIsProcessing(false);

      // To test the listener in your app, you can manually emit a mock event.
      if (window.Fleetbo && window.Fleetbo.mockEmit) {
        window.Fleetbo.mockEmit('IMAGE_PROCESSED', mockPayload);
      }

    }, 1500);
  };

  return (
    <>
      <PageConfig navbar="none" />
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100"
        style={{ backgroundColor: '#111' }}
      >
        <div
          className="position-relative d-flex align-items-center justify-content-center"
          style={{ width: '100%', height: '80%', backgroundColor: '#000' }}
        >
          {capturedImage ? (
            <img
              src={capturedImage.fullUri}
              alt="Captured Preview"
              className="img-fluid h-100"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <CameraIcon color="rgba(255, 255, 255, 0.2)" size={128} />
          )}
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: '100%', height: '20%', backgroundColor: '#1a1a1a' }}
        >
          {capturedImage ? (
            <div className="text-center text-success">
              <CheckCircle size={48} className="mb-2" />
              <p className="mb-0">Image Processed</p>
              <small
                className="text-white-50"
                onClick={() => setCapturedImage(null)}
                style={{ cursor: 'pointer' }}
              >
                Reset
              </small>
            </div>
          ) : (
            <button
              className="btn btn-outline-light rounded-circle"
              style={{ width: '70px', height: '70px' }}
              onClick={handleMockCapture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <CameraIcon size={32} />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Camera;

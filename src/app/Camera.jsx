import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Fleetbo = window.Fleetbo;

function Camera() {
  const [captured, setCaptured] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/createtask';

  const handleCapture = () => {
    const uri = 'https://fleetbo.io/images/console/gallery/3.png';
    setPhotoUri(uri);
    setCaptured(true);
  };

  const handleUsePhoto = () => {
    if (Fleetbo && Fleetbo.close) {
      Fleetbo.close({ uri: photoUri });
    } else {
      navigate(returnTo, { state: { photoUri } });
    }
  };

  const handleRetake = () => {
    setCaptured(false);
    setPhotoUri(null);
  };

  const handleClose = () => {
    if (Fleetbo && Fleetbo.close) {
      Fleetbo.close();
    } else {
      navigate(returnTo);
    }
  };

  if (captured) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, height: 80 }}>
          <div onClick={handleClose} style={{ color: 'white', fontSize: 24, cursor: 'pointer' }}>✕</div>
          <div style={{ color: 'white' }}>Preview</div>
          <div style={{ width: 30 }} />
        </div>
        <div style={{ flex: 1 }}>
          <img src={photoUri} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'black', height: 140, padding: 20 }}>
          <button onClick={handleRetake} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '12px 24px', borderRadius: 4 }}>
            Retake
          </button>
          <button onClick={handleUsePhoto} style={{ backgroundColor: '#0E904D', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 4 }}>
            Use Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, height: 80 }}>
        <div onClick={handleClose} style={{ color: 'white', fontSize: 24, cursor: 'pointer' }}>✕</div>
        <div style={{ color: 'white' }}>Camera</div>
        <div style={{ width: 30 }} />
      </div>
      <div style={{ flex: 1, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '100%', backgroundImage: 'url(https://fleetbo.io/images/console/gallery/3.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', height: 140 }}>
        <div onClick={handleCapture} style={{ width: 70, height: 70, borderRadius: '50%', border: '4px solid white', backgroundColor: 'white', cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default Camera;

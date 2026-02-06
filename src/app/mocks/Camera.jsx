import React, { useState } from "react";
import { Camera, X, Zap } from "lucide-react";

export default function NativeCamera() {
  const [processing, setProcessing] = useState(false);
  const [flash, setFlash] = useState(false);

  const takePicture = () => {
    // 1. Visual Feedback (Flash)
    setFlash(true);
    setTimeout(() => setFlash(false), 100);

    // 2. Simulate Hardware Processing Latency
    setProcessing(true);

    setTimeout(() => {
      // 3. Generate Sovereign Asset (Fleetbo Internal CDN Bank)
      const randomId = Math.floor(Math.random() * 10);
      const imageUrl = `https://fleetbo.io/images/console/gallery/${randomId}.png`;

      // 4. Return Signal to Pilot
      // Protocol: F_IMAGE -> { url: string }
      Fleetbo.close({
        type: "FLEETBO_RESULT",
        kind: "F_IMAGE",
        data: { url: imageUrl },
      });
    }, 800);
  };

  const closeModule = () => {
    Fleetbo.close();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-black d-flex flex-column z-3">
      {/* Flash Overlay */}
      {flash && (
        <div
          className="position-absolute w-100 h-100 bg-white"
          style={{ zIndex: 2000, opacity: 0.8 }}
        />
      )}

      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center p-4 text-white">
        {/* Override the typical onclose behavior to lead to profie tab which has config set to true */}
        <button
          onClick={() => closeModule()}
          className="btn btn-link text-white p-0"
        >
          <X size={28} />
        </button>
        <div className="bg-dark rounded-pill px-3 py-1 small opacity-75">
          PHOTO
        </div>
        <Zap size={24} className="opacity-50" />
      </div>

      {/* Viewfinder Area */}
      <div className="flex-grow-1 position-relative bg-dark overflow-hidden">
        {/* Grid Lines */}
        <div className="position-absolute top-50 start-0 w-100 border-top border-white opacity-25" />
        <div className="position-absolute top-0 start-50 h-100 border-start border-white opacity-25" />

        {/* Simulated Lens Feed */}
        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white-50">
          {!processing && <Camera size={48} className="opacity-25" />}
          {processing && <span className="spinner-border text-light" />}
        </div>
      </div>

      {/* Bottom Controls (Shutter) */}
      <div className="p-5 d-flex justify-content-center align-items-center bg-black">
        <button
          onClick={takePicture}
          disabled={processing}
          className="btn p-0 rounded-circle border border-4 border-white d-flex align-items-center justify-content-center"
          style={{ width: "72px", height: "72px" }}
        >
          <div
            className="bg-white rounded-circle"
            style={{ width: "60px", height: "60px" }}
          />
        </button>
      </div>
    </div>
  );
}
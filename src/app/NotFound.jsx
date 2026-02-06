// src/app/NotFound.jsx
import React from 'react';
const NotFound = () => {
    return (
    <div className="d-flex justify-content-center align-items-center text-center vh-100 bg-light">
      <div>
        <h1 className="display-1 fw-bold text-secondary">404</h1>
        <p className="lead text-muted">
          Page not found.
        </p>
        <button 
          onClick={()=> Fleetbo.back()}
          className="btn btn-success w-100 mt-3"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
export default NotFound;

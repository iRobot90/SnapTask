// src/components/common/Loader.jsx
import React from 'react';

const Loader = () => {
  // On génère 3 fausses cartes pour simuler une liste
  const skeletonItems = [1]; 

  return (
    <div className="w-100 p-3 animate-fade-in">
      {skeletonItems.map((item) => (
        <div key={item} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-3" aria-hidden="true">
          
          {/* 1. FAUSSE IMAGE (Gris Clignotant) */}
          <div className="bg-light placeholder-glow d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
             {/* Optionnel : une icône grise très pâle au milieu */}
             <span className="placeholder col-12 h-100 opacity-25"></span>
          </div>

          {/* 2. FAUX TEXTE */}
          <div className="card-body">
            {/* Titre */}
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6 bg-secondary rounded"></span>
            </h5>
            {/* Description (2 lignes) */}
            <p className="card-text placeholder-glow">
              <span className="placeholder col-7 bg-secondary rounded me-1"></span>
              <span className="placeholder col-4 bg-secondary rounded"></span>
              <span className="placeholder col-4 bg-secondary rounded me-1"></span>
              <span className="placeholder col-6 bg-secondary rounded"></span>
            </p>
          </div>

          {/* 3. FAUX BOUTONS (Footer) */}
          <div className="card-footer bg-white border-top-0 px-3 pt-1 pb-3 d-flex justify-content-between align-items-center placeholder-glow">
              <span className="placeholder col-3 py-3 rounded-pill bg-light"></span>
              <span className="placeholder col-1 py-3 rounded bg-light"></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
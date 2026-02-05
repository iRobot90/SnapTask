//src/hooks/useLoadingTimeout

import React from 'react';

export const useLoadingTimeout = (loadingState, setLoadingState, setErrorState, timeoutMs = 15000) => {
  React.useEffect(() => {
    if (!loadingState) return;
    
    const failsafeTimeout = setTimeout(() => {
      if (loadingState) {
        setLoadingState(false);
        setErrorState("Délai d'attente dépassé. Veuillez réessayer.");
      }
    }, timeoutMs);
    
    return () => clearTimeout(failsafeTimeout);
  }, [loadingState, setLoadingState, setErrorState, timeoutMs]);
};

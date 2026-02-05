//src/components/common/PageConfig.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageConfig = ({ navbar }) => {
    const location = useLocation();
    useEffect(() => {
        const route = location.pathname;
        let navbarState = navbar || 'none';
        // Security logic
        if (navbarState !== 'show' && navbarState !== 'visible') {
            navbarState = 'none';
        }  
        if (window.Fleetbo && typeof window.Fleetbo.onWebPageReady === 'function') {
            Fleetbo.onWebPageReady(route, navbarState);
        }
    }, [location, navbar]);
    return null;
};

export default PageConfig;

import { useEffect } from 'react';

const PageConfig = ({ navbar }) => {
    useEffect(() => {
        if (window.Fleetbo && typeof window.Fleetbo.onWebPageReady === 'function') {
            const navbarState = navbar === 'show' ? 'show' : 'none';
            Fleetbo.onWebPageReady(window.location.pathname, navbarState);
        }
    }, [navbar]);
    return null;
};

export default PageConfig;

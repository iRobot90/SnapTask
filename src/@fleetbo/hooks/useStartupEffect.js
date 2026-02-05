import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export const useStartupEffect = () => {
    const location = useLocation(); 
    const navigate = useNavigate();

    const isReadyRef = useRef(false);

    const [isFleetboReady, setIsFleetboReady] = useState(false);
    const [initializationError, setInitializationError] = useState(null);

    useEffect(() => {
        let timer = null;
        let requester = null; 

        const cleanup = () => {
            if (timer) clearTimeout(timer);
            if (requester) clearInterval(requester);
            window.removeEventListener('message', handleMessage);
        };

        const onFleetboReady = () => {
            if (isReadyRef.current) return; 
            isReadyRef.current = true;

            cleanup(); 
            setIsFleetboReady(true);
        };

        const handleMessage = (event) => {
            if (event.data && event.data.type === 'FLEETBO_DELIVER_ENGINE') {
                try {
                    if (!document.getElementById('fleetbo-native-engine')) {
                        const scriptEl = document.createElement('script');
                        scriptEl.id = 'fleetbo-native-engine';
                        scriptEl.innerHTML = event.data.code;
                        document.head.appendChild(scriptEl);
                    }

                    setTimeout(() => {
                        if (window.Fleetbo) {
                            onFleetboReady();
                        }
                    }, 50);
                    
                } catch (e) {
                    console.error("Engine Injection Error:", e);
                    setInitializationError("Failed to execute the fleetbo engine.");
                    cleanup();
                }
            }
        };

        if (window.fleetbo && typeof window.fleetbo.fleetboLog === 'function') {
            if (window.Fleetbo) {
                onFleetboReady();
            } else {
                requester = setInterval(() => {
                    if (window.Fleetbo) onFleetboReady();
                }, 100);
            }
        }

        else if (window.self !== window.top) {
            window.addEventListener('message', handleMessage);

            requester = setInterval(() => {
                if (isReadyRef.current) {
                    cleanup();
                    return;
                }
                
                if (window.Fleetbo) { 
                    onFleetboReady();
                    return;
                }
                
                if (window.parent) {
                    window.parent.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*');
                }
            }, 500); 
        } 
        
        else {
             setTimeout(() => {
                 if (!isReadyRef.current) {
                     setInitializationError("Running outside of Fleetbo Environment.");
                 }
             }, 2000);
        }
        timer = setTimeout(() => {
            if (!isReadyRef.current) {
                setInitializationError("Connection Timeout.");
                cleanup();
            }
        }, 15000); 

        return cleanup;
    // eslint-disable-next-line
    }, []); 

    useEffect(() => {
        window.navigateToTab = (route) => {
            navigate(route);
        };
    }, [navigate]);

    useEffect(() => {
        if(isFleetboReady) {
            const lastActiveTab = localStorage.getItem("activeTab") || "Tab1";
            const initialRoute = `/${lastActiveTab.toLowerCase()}`;
            if (location.pathname === '/' && initialRoute !== '/tab1') { 
                navigate(initialRoute, { replace: true });
            }
        }
    }, [isFleetboReady, location.pathname, navigate]); 

    return { isFleetboReady, initializationError };
};

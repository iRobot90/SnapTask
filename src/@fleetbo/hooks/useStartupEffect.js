import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export const useStartupEffect = () => {
    const location = useLocation(); 
    const navigate = useNavigate(); // eslint-disable-next-line no-unused-vars

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
            console.log("Received message:", event.data);
            if (event.data && event.data.type === 'FLEETBO_DELIVER_ENGINE') {
                try {
                    console.log("Engine received, injecting...");
                    if (!document.getElementById('fleetbo-native-engine')) {
                        const scriptEl = document.createElement('script');
                        scriptEl.id = 'fleetbo-native-engine';
                        scriptEl.innerHTML = event.data.code;
                        document.head.appendChild(scriptEl);
                    }

                    setTimeout(() => {
                        console.log("Checking for window.Fleetbo:", !!window.Fleetbo);
                        if (window.Fleetbo) {
                            onFleetboReady();
                        } else {
                            console.error("window.Fleetbo not found after injection");
                        }
                    }, 50);
                    
                } catch (e) {
                    console.error("Engine Injection Error:", e);
                    setInitializationError("Failed to execute the fleetbo engine.");
                    cleanup();
                }
            }
        };

        console.log("Debug - window.fleetbo:", !!window.fleetbo);
        console.log("Debug - window.fleetbo.fleetbo:", !!window.fleetbo?.fleetboLog);
        console.log("Debug - window.self !== window.top:", window.self !== window.top);
        
        if (window.fleetbo && typeof window.fleetbo.fleetboLog === 'function') {
            console.log("Native bridge detected");
            if (window.Fleetbo) {
                onFleetboReady();
            } else {
                requester = setInterval(() => {
                    if (window.Fleetbo) onFleetboReady();
                }, 100);
            }
        }

        else if (window.self !== window.top) {
            console.log("Running in iframe, setting up message listener");
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
                    console.log("Requesting engine from parent...");
                    window.parent.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*');
                }
            }, 500); 
        } 
        
        else {
            console.log("Running in standalone browser");
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

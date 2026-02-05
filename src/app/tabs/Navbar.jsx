import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const navItems = [
  { id: 'Tab1', view: 'tab1',   isNative: false, label: 'Tab 1' },
  { id: 'Tab2', view: 'Sample', isNative: true,  label: 'Tab 2' }, 
  { id: 'Tab3', view: 'tab3',   isNative: false, label: 'Tab 3' },
];

const Navbar = () => {
  const location = useLocation();

  const getNavbarType = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'header') return 'header';
    if (params.get('type') === 'footer') return 'footer';
    const savedType = localStorage.getItem("navbar");
    if (savedType) return savedType;
    return 'footer';
  };

  const [navbarType, setNavbarType] = useState(getNavbarType);

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const activeRoute = params.get('activeRoute');
    if (activeRoute) {
      const matchedTab = navItems.find(item => !item.isNative && activeRoute.includes(`/${item.view}`));
      if (matchedTab) return matchedTab.id;
    }
    // C'est ici que la magie opère au redémarrage de la Navbar
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || 'Tab1';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const handleMessage = (event) => {
        if (!event.data) return;
        const { type, route, navbarMode } = event.data;
        
        // Moteur : Changement de route détecté
        if (type === 'SET_ACTIVE_ROUTE') {
            const matchedTab = navItems.find(item => !item.isNative && route.includes(`/${item.view}`));
            if (matchedTab) {
                setActiveTab(matchedTab.id);
                // ✅ FIX : On persiste l'état pour survivre au démontage/remontage
                localStorage.setItem("activeTab", matchedTab.id); 
            }
        }
        
        if (type === 'SET_NAVBAR_TYPE') {
            setNavbarType(navbarMode);
            localStorage.setItem("navbar", navbarMode);
        }
    };
    window.addEventListener('message', handleMessage);
    
    // Demande au parent où on est (au cas où on vient d'être monté)
    if (window.top !== window.self) {  
        window.top.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*'); 
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Ce useEffect est moins utile dans l'iframe (car location = /navbar) mais on le garde par sécurité
  useEffect(() => {
    const currentTab = navItems.find(item => !item.isNative && location.pathname.includes(item.view));
    if (currentTab) { 
        setActiveTab(currentTab.id); 
        localStorage.setItem("activeTab", currentTab.id); 
    }
  }, [location]);

  const handleSelectTab = (item) => {
    setActiveTab(item.id);
    // ✅ FIX : On persiste le choix manuel immédiatement
    localStorage.setItem("activeTab", item.id); 
    
    if (window.Fleetbo) {  
        window.Fleetbo.openView(item.view, item.isNative); 
    } else { 
        console.warn("Fleetbo engine not found"); 
    }
  };

  // --- MINIMALIST STYLES (INLINE) ---
  const styles = {
   container: {
        position: 'fixed',
        left: 0,
        right: 0,
        height: '70px',    
        paddingBottom: 'env(safe-area-inset-bottom)', 
        boxSizing: 'border-box',    
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(247, 246, 246, 0.95)',
        zIndex: 1000,
        ...(navbarType === 'header' 
            ? { top: 0, borderBottom: '1px solid transparent' } 
            : { bottom: 0, borderTop: '1px solid transparent' }
        )
    },
    button: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        padding: '8px',
        cursor: 'default', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.2s',
        color: '#999', 
    },
    activeButton: {
        color: '#0E904D', 
        fontWeight: 'bold'
    },
    label: {
        fontSize: '12px',
        marginTop: '4px'
    }
  };

  return (
    <div style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => handleSelectTab(item)}
            style={{ 
                ...styles.button, 
                ...(isActive ? styles.activeButton : {}) 
            }}
          >
            <span style={styles.label}>
                {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;

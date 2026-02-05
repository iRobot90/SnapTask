// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading]     = useState(true);
    const [isLoggedIn, setIsLoggedIn]   = useState(false);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try { 
                const data     = await Fleetbo.checkAuthStatusAndRedirect();
                setSessionData(data);
                if (data && data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setSessionData(data);
                } else {
                    setIsLoggedIn(false); 
                }
            } catch (error) {
                setIsLoggedIn(false);
                setSessionData(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const login = (data) => {
        setIsLoggedIn(true);
        setSessionData(data);
    };
    const value = { isLoading, isLoggedIn, sessionData, setIsLoggedIn, login };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};

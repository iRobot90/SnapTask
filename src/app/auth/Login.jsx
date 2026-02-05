/**
 * === Fleetbo Developer Guide: The Authentication Gateway (Login.jsx) ===
 *
 * This component is the ignition key for your application.
 * It establishes the secure link with the Fleetbo Native Engine.
 *
 * --- Core Concepts ---
 * 1. Starting the Engine (`Fleetbo.log`):
 * We don't manage tokens here. We send a `log` command to the Engine.
 * The Engine then takes over to:
 * - Identify the user via secure hardware protocols.
 * - Initialize the encrypted storage layer.
 *
 * 2. Zero-Config Auth:
 * No SDKs to configure. The Fleetbo Engine handles the entire authentication
 * lifecycle (Biometrics, Refresh Cycles, Network Security) autonomously.
 *
 * 3. Engine-Driven Navigation:
 * Upon success, the Javascript layer yields control. The Engine performs
 * a native transition to the main app context.
 */

import React, { useState } from 'react';
import { motion } from "framer-motion";
import 'app/assets/css/Auth.css';
import logo from 'app/assets/images/logo.png';
import { useAuth, PageConfig } from '@fleetbo';

const DEFAULT_TAB = 'tab1'; 

const Login = () => {
    const [loadingLog, setLoadingLog] = useState(false);
    const [loadingLeave, setLoadingLeave] = useState(false); 
    const { sessionData, isLoading: isAuthLoading } = useAuth();

    const handleSecureConnection = async () => {
        if (loadingLog || loadingLeave) return;
        setLoadingLog(true);

        try {
            // 1. Find the last active tab ID, or default
            const lastActiveTabId = localStorage.getItem('activeTab') || DEFAULT_TAB;
            
            // 2. Call the *simplified* native log function
            await Fleetbo.log(lastActiveTabId.toLowerCase());
            
        } catch (error) {
            console.error(`Connection error: ${error.message}`);
            setLoadingLog(false);
            alert(`Connection failed: ${error.message}`);
        }
    };

    const leaveApp = async () => { 
        if (loadingLog || loadingLeave) return;
        setLoadingLeave(true);   

        try {
            Fleetbo.logout(); 
        } catch (error) {
            console.error(`Error: ${error.message}`);
            setLoadingLeave(false); 
        }
        
        setTimeout(() => setLoadingLeave(false), 1500); 
    };

    const renderContent = () => {
        if (isAuthLoading) {
            return (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">.</span>
                    </div>
                </div>
            );
        }

        if (sessionData) {
            return (
                <>
                    <img
                        className='w-25 mb-3'
                        src={logo}
                        alt="logo"
                    />
                    <h3 className='fw-bolder text-dark mb-1'>
                        Welcome to {sessionData.appName || "Fleetbo"}
                    </h3>
                    <p className='text-muted fs-6 mb-4'>
                        You are authenticated.
                    </p>
                    
                    <button 
                        onClick={handleSecureConnection} 
                        className="btn p-3 fs-6 btn-success" 
                        disabled={loadingLog || loadingLeave}
                    >
                        {loadingLog ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Activating...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-shield-halved me-2"></i>
                                Activate Connection
                            </>
                        )}
                    </button>

                    <button 
                        onClick={leaveApp} 
                        className="btn btn-link text-secondary text-decoration-none mt-3" 
                        style={{ fontSize: '14px' }}
                        disabled={loadingLog || loadingLeave}
                    >
                        {loadingLeave ? "Disconnecting..." : "Wrong Account?"}
                    </button>

                    <p className="mt-4 text-muted" style={{ fontSize: '12px' }}>
                        Finalizing your secure app connection.
                    </p>
                </>
            );
        }
        return <p className="text-danger">Failed to load app data.</p>;
    };

    return (
        <>
            <PageConfig navbar="none" />  
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="login-passerelle-container"
            >
                <div className="login-passerelle-box">
                    {renderContent()}
                </div>   
            </motion.div>
        </>
    );
};

export default Login;


import React, { useEffect, useState, useCallback } from 'react';
import { fleetboDB, useLoadingTimeout, Loader, PageConfig, formatFirestoreDate } from '@fleetbo';
import avatarImage from 'app/assets/images/avatar.png';
import { UserPlus, LogOut } from 'lucide-react';

const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Profile </h2>
        </header>
    );
};

const Tab3 = () => {
    const [isLoading, setIsLoading]       = useState(true);
    const [userData, setUserData]         = useState(null);
    const [error, setError]               = useState(null);
    const [isNotFound, setIsNotFound]     = useState(false); 
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dbName                          = "users";
    
    // keep
    useLoadingTimeout(isLoading, setIsLoading, setError);

    // 2. Fetch 
    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsNotFound(false);

        try {
            const response = await Fleetbo.getAuthUser(fleetboDB, dbName);
            if (response.success && response.data) {
                const data = response.data;
                setUserData({
                    username: data.username || data.name || "User",
                    phoneNumber: data.phoneNumber || data.phone || "No Phone",
                    dateCreated: formatFirestoreDate(data.dateCreated || data.createdAt),
                });
            } else if (response.notFound) {
                setIsNotFound(true);
            } else {
                setError(response.message || "Error loading profile.");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError("Connection error.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleLogout = () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        Fleetbo.logout();
    };

    // 3. Button Component Logout  
    const LogoutButton = () => (
        <button
            onClick={handleLogout}
            className="btn btn-link w-100 fs-6 mt-3 text-secondary" 
            disabled={isLoggingOut}
        >
            {isLoggingOut ? (
                <><i className="fas fa-spinner fa-spin me-2"></i> Logging out...</>
            ) : (
                <><LogOut size={18} className="me-2" /> Log Out</>
            )}
        </button>
    );

    const renderContent = () => {
        if (error) {
            return (
                <div className="alert alert-danger text-center">
                    <p>{error}</p>
                    <button className="btn btn-outline-danger btn-sm" onClick={fetchUserData}>Retry</button>
                    <div className="mt-3"><LogoutButton /></div> 
                </div>
            );
        }

        if (isNotFound) {
            return (
                <div className="container text-center mt-4">
                    <div className="mb-3 text-success opacity-75">
                        <UserPlus size={64} />
                    </div>
                    <h4 className="fw-bold text-dark">Welcome!</h4>
                    <p className="text-muted mb-4">
                        Your user profile is not yet complete.<br/>
                        Please create it to continue.
                    </p>
                    <button onClick={() => Fleetbo.openPage('setuser')} className="btn btn-success mb-2">
                        Create Profile
                    </button>
                    <LogoutButton />
                </div>
            );
        }

        if (userData) {
            return (
                <div className="container mt-4">
                    <div className="text-center mb-4">
                        <img
                            src={avatarImage}
                            alt="User avatar"
                            className="shadow-sm"
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <h2 className="text-success fw-bolder mt-3 mb-0">
                            {userData.username}
                        </h2>
                        <p className="text-muted small mt-1">
                            Member since {userData.dateCreated}
                        </p>
                    </div>
                    
                    {/* Section Infos (Example) */}
                    <div className="card shadow-sm mb-4 text-start">
                        <div className="card-body">
                            <small className="text-uppercase text-muted fw-bold" style={{fontSize: '11px'}}>Phone</small>
                            <div className="fs-6 fw-medium">{userData.phoneNumber}</div>
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            );
        }
        return null; 
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <PageConfig navbar="show" />
            <Tab3Header />
            <div className="position-relative d-flex flex-column justify-content-center align-items-center text-center w-100" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;

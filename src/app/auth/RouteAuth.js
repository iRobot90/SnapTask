import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Loader from '@fleetbo/components/common/Loader'; 

/**
 * This component acts as a router/switcher.
 * It reads the state ('login' or 'welcome') stored by the native code,
 * ensures that the navigation bar is hidden,
 * and redirects the user to the appropriate page using React Router.
 */
const RouteAuth = () => {
    const navigate = useNavigate(); 

    useEffect(() => {

        const data = localStorage.getItem('AppInfo');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.state === "welcome") {
                    navigate('/tab1', { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                navigate('/login', { replace: true });
            }
        } 
    }, [navigate]); 

    return <Loader />;
};

export default RouteAuth;

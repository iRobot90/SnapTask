import { useState, useEffect } from 'react';
import Fleetbo from 'api/fleetbo'; 
const useModalLauncher = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const handleShowModal = () => {
            setIsModalOpen(true);
        };
        window.addEventListener('showModalRequest', handleShowModal);
        return () => {
            window.removeEventListener('showModalRequest', handleShowModal);
        };
    }, []); 
    const closeModal = () => {
        setIsModalOpen(false);
        if (window.Fleetbo && window.Fleetbo.setNavbarVisible) {
            Fleetbo.setNavbarVisible();
        }
    };
    return { isModalOpen, closeModal };
};
export default useModalLauncher;

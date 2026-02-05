import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'api/fleetbo'; 
import 'assets/css/InfoModal.css';

const MyModal = ({ isOpen, onClose }) => {
    const showClassName = isOpen ? "show" : "";
    const showStyle = isOpen ? { display: 'block' } : {};

    return (
        <div 
            className={`modal fade ${showClassName}`} 
            style={showStyle} 
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    
                    {/* --- VOTRE HEADER PERSONNALISÉ INTÉGRÉ ICI --- */}
                    <header className='navbar ps-3 pt-3'>
                        <div className=''>
                            <Link className='back text-white' onClick={onClose}  >
                                <h3> 
                                    <i className="fa-solid fa-arrow-left me-2"></i> 
                                    Informations
                                </h3>
                            </Link>
                        </div>
                        <div className="navbar-right">
                            <button onClick={() => Fleetbo.openGalleryView() }  className="logout fw-bold">
                                <i className="fa-solid fs-5 fa-image"></i>
                            </button>
                        </div>
                    </header>
                    {/* --- FIN DU HEADER PERSONNALISÉ --- */}
                    
                    <div className="modal-body">
                        <div className="row p-1">
                            <div style={{ textAlign: "justify" }}>
                                <div className='context-content'>
                                    {/* --- Section Présentation --- */}
                                    <h4 className="fw-bold text-warning mt-2">MyModal</h4>
                                    <br />
                                    <div className='col-md-10 mt-1'>
                                        <span className='text-dark fw-normal' style={{ fontFamily: "tahoma", fontSize: "18px", textAlign: 'justify' }}> 
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                            <br /> 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyModal;


import React from 'react';
import PageConfig from '@fleetbo/components/common/PageConfig';


const SampleHeader = () => {
    return (
        <header className='navbar ps-3 pe-3 pt-3 bg-white sticky-top border-bottom' style={{ zIndex: 1020, top: 0, height: '70px' }}>
            <h2 className='fw-bolder fb-name text-dark mb-0'>Sample</h2>
        </header>
    );
};

const SampleMock = () => {
    return (
        <>
            <PageConfig navbar="show" />
            <SampleHeader />
            <div 
                className="position-relative d-flex justify-content-center align-items-center" 
                style={{ minHeight: 'calc(100vh - 150px)' }}
            >
                <div className="login-header-text-container text-center">
                    <h1 className="login-app-name">Sample Mock</h1>
                    <p className="login-description">
                        Here is native view for more performance...
                    </p>
                </div>
            </div>
        </>
    );
};

export default SampleMock;

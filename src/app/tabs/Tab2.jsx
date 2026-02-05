import React from 'react';
import PageConfig from '@fleetbo/components/common/PageConfig';

const Tab2Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Interface</h2>
        </header>
    );
};

const Tab2 = () => {
    const renderContent = () => {
        return (
            <div>
                <h5 className="text-secondary fw-normal">Build your interface here...</h5>
            </div>
        );
    };

    return (
        <>
            <PageConfig navbar="show" />
            <Tab2Header />
            <div className="p-3 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab2;

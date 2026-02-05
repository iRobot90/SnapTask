/**
 * === Fleetbo Developer Guide: The Standard List Page (Tab1.jsx) ===
 *
 * This file demonstrates the "Engine-First" architecture.
 * Your React component acts as a view layer for the Fleetbo Data Engine.
 *
 * --- Core Concepts ---
 * 1. Native UI Control (`<PageConfig />`):
 * Directives sent to the OS to control native elements.
 * - navbar="show": Instructs the Engine to render the native TabBar.
 * - navbar="none": Requests full immersive mode.
 *
 * 2. Direct Data Pipeline (`getDocsG`):
 * Instead of HTTP requests, we open a direct pipe to the Fleetbo Engine.
 * `await Fleetbo.getDocsG(...)` retrieves secure objects instantly from the core.
 *
 * 3. The "Zero-Latency" Pattern (Optimistic UI):
 * We update the UI instantly, then notify the Engine in the background.
 * 1. User taps Delete -> Item vanishes (Instant feedback).
 * 2. The Engine receives the delete order asynchronously.
 * 3. If the Engine reports a failure, the UI reverts automatically.
 *
 * --- Developer Note ---
 * You are abstracted from the backend logic. Focus purely on the UI state.
 * The Fleetbo Engine guarantees data integrity and security.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { fleetboDB, useLoadingTimeout, Loader, PageConfig } from '@fleetbo';
import { MessageCirclePlus, ImageIcon, Inbox, Eye, Trash2, Bell, RefreshCcw } from 'lucide-react';

const Tab1Header = () => {
    return (
        <header className='navbar ps-3 pe-2 pt-3 bg-white sticky-top border-bottom' style={{ zIndex: 1020, top: 0, height: '70px' }}>
            <h2 className='fw-bolder fb-name text-dark mb-0'>Feed</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.exec('Device', 'playSound', { id: 'notification' }) } className="btn-header text-success me-3 fs-5 fw-bold" title="Add New Item">
                    <Bell />
                </button>
                <button onClick={() =>  Fleetbo.openPage('insert') } className="btn-header text-success fs-5 fw-bold" title="Add New Item">
                    <MessageCirclePlus />
                </button>
            </div>
        </header>
    );
};

const Tab1 = () => {
    const [isLoading, setIsLoading]   = useState(true);
    const [data, setData]             = useState([]);          
    const [error, setError]           = useState("");           
    const collectionName              = "items";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchData = useCallback(async () => {
        // UX : On remet le skeleton seulement si la liste est vide (Premier chargement)
        // Si on a déjà des items, on fait un refresh silencieux 
        if(data.length === 0) setIsLoading(true);
        setError("");
        
        try {
            const response = await Fleetbo.getDocsG(fleetboDB, collectionName);
            if (response.success) { 
                const sortedData = (response.data || []).sort((a, b) => {
                    const dateA = a.dateCreated ? new Date(a.dateCreated) : new Date(0);
                    const dateB = b.dateCreated ? new Date(b.dateCreated) : new Date(0);
                    return dateB - dateA;
                });
                setData(sortedData); 
            } else { setError(response.message || "Error fetching data."); }
        } catch (err) {
            console.error("--> [FLEETBO_DEBUG] Engine error: ", err);
            setError(`Native Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [data.length]);  

    useEffect(() => {
        let isMounted = true; 
        const load = async () => { if (!isMounted) return;  await fetchData(); };
        load();
        return () => { isMounted = false; };
    }, [fetchData]);

    const deleteItem = (id) => {
        // Optimistic UI : On supprime visuellement tout de suite
        setData(currentItems => currentItems.filter(item => item.id !== id));
        Fleetbo.delete(fleetboDB, "items", id)
               .then(() => { console.log(" Server Cleaned"); })
               .catch(err => { console.error(" Delete failed", err); fetchData(); }); 
    };

    const renderContent = () => {
        
        // 1. GESTION ERREUR
        if (error) {
            return (
                <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 h-100">
                     <div className="alert alert-danger d-flex flex-column align-items-center text-center m-3 p-4 shadow-sm w-75">
                        <span className="mb-3">{error}</span>
                        <button className="btn btn-outline-danger btn-sm" onClick={fetchData}>Retry Connection</button>
                    </div>
                </div>
            );
        }
        
        // 2. GESTION CHARGEMENT (SQUELETTE)
        if (isLoading && data.length === 0) {
            return <Loader />;
        }

        // 3. AFFICHAGE CONTENU (Liste ou Vide)
        return (
            <div className="d-flex flex-column flex-grow-1 h-100"> 
                {/* TOOLBAR (Sticky) */}
                <div 
                    className="d-flex justify-content-between align-items-center px-3 py-2 bg-white border-bottom sticky-top shadow-sm"
                    style={{ zIndex: 1010, top: '70px' }} 
                >
                    <span className='text-muted small fw-bold'>{data.length} Publications</span>
                    <button className="btn-header text-success text-decoration-none p-0 d-flex align-items-center" onClick={() => { setIsLoading(true); fetchData(); }} disabled={isLoading}>
                        <RefreshCcw size={14} className={`me-1 ${isLoading ? 'fa-spin' : ''}`} /> 
                        Refresh
                    </button>
                </div>

                {/* CONTENEUR LISTE */}
                <div className={`flex-grow-1 p-3 ${data.length === 0 ? 'd-flex flex-column align-items-center justify-content-center' : ''}`}>
                    {data.length > 0 ? (
                        <div className="w-100">
                             <div className="row g-3">
                                {data.map((item) => (
                                    <div key={item.id} className='col-12'>
                                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                                            {/* IMAGE */}
                                            {item.image ? (
                                                <div 
                                                    className="w-100 bg-light d-flex align-items-center justify-content-center" 
                                                    style={{ height: '250px', overflow: 'hidden', cursor: 'pointer' }}
                                                    onClick={() => Fleetbo.openPageId('item', item.id)}
                                                >
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.title} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Error"; }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-100 bg-light d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '100px' }}>
                                                    <ImageIcon size={24} className="mb-1 opacity-50"/>
                                                    <small style={{fontSize: '10px'}}>No image</small>
                                                </div>
                                            )}

                                            {/* TEXTE */}
                                            <div className="card-body px-3 pt-3 pb-1">
                                                <h6 className="mb-0 fw-bold text-dark">{item.title || 'Untitled Post'}</h6>
                                                <p className="card-text text-secondary text-truncate small">
                                                    {item.content || 'No description.'}
                                                </p>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="card-footer bg-white border-top-0 px-3 pt-1 pb-3 d-flex justify-content-between align-items-center">
                                                <button onClick={() => Fleetbo.openPageId('item', item.id)} className="btn btn-sm btn-light text-success fw-bold px-3 rounded-pill d-flex align-items-center">
                                                    <Eye size={16} className="me-2"/> Read
                                                </button>
                                                <button onClick={() => deleteItem(item.id)} className="btn btn-link text-danger p-2" >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    ) : (
                        /* EMPTY STATE */
                        <div className="text-center text-muted animate-fade-in">
                            <div className="mb-4 p-4 bg-light rounded-circle d-inline-block shadow-sm">
                                <Inbox size={48} className="text-success opacity-75" />
                            </div>
                            <h5 className="fw-bold text-dark mb-2">No publications yet</h5>
                            <p className="small text-secondary mb-4">Your feed is empty. Start creating content.</p>
                            <button className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm d-inline-flex align-items-center" onClick={() => Fleetbo.openPage('insert')}>
                                <MessageCirclePlus size={18} className="me-2"/> Create First Post
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ARCHITECTURE COQUILLE : Le Header est toujours là, seul le contenu change.
    return (
        <>
            <PageConfig navbar="show" />
            <div className="d-flex flex-column bg-white" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
                <Tab1Header />
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
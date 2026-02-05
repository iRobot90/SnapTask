import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fleetboDB, PageConfig } from '@fleetbo';
import { ArrowLeftCircle, Images, Camera } from 'lucide-react';


const InsertHeader = ({ onBack, onGallery }) => {
    return (
        <header className='navbar ps-3 pt-3'>
            <div>
                <button onClick={onBack} className="btn-header text-success fs-5 fw-bold d-flex align-items-center">
                    <ArrowLeftCircle/> <span className='ms-3'>Insert</span>
                </button>
            </div>
            <div className="navbar-right pe-3">
                <button onClick={onGallery} className="btn-header fs-5 text-success fw-bold">
                     <Images />
                </button>
            </div>
        </header>
    );
};

const Insert = () => {
    const [loading, setLoading]             = useState(false);
    const [title, setTitle]                 = useState("");
    const [content, setContent]             = useState("");
    const [message, setMessage]             = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Le pilote écoute passivement. Alex (le moteur) envoie le signal quand il est prêt.
    const openCamera = async () => {
       // Appel au module natif (ou au Mock en dev)
       //const result = await Fleetbo.exec('DatingCamera');
       const result = await Fleetbo.exec('StockCamera', 'open', {});
       
       // Gestion du retour universel
       if (result && result.url) {
           console.log('Nouvelle photo de profil :', result.url);
           if (result.url) setSelectedImage(result.url);
           // setProfilePic(result.url);
       }
    };

    const handleOpenGallery = async () => {
       // Appel asynchrone au module natif
       // const result = await Fleetbo.exec('NativeGallery');
       const result = await Fleetbo.exec('NativeGallery', 'capture', {});
       
       // Gestion universelle du retour (Mock ou Natif)
       if (result && result.url) {
           console.log('Image sélectionnée:', result.url);
           //setImage(result.url); // Mettre à jour ton state
           if (result.url) setSelectedImage(result.url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!title || !content) {
            setMessage({ type: 'danger', text: "Title and Description are required." });
            return;
        }

        setLoading(true);
        const jsonData = JSON.stringify({ 
            title, 
            content, 
            image: selectedImage 
        });

        try {
            if (selectedImage) {
                await Fleetbo.addWithLastSelectedImage(fleetboDB, "items", jsonData);
            } else {
                await Fleetbo.add(fleetboDB, "items", jsonData);
            }

            setMessage({ type: 'success', text: "Item added successfully!" });
            setTitle(""); setContent(""); setSelectedImage(null);
            
            Fleetbo.getToken().then(res => {
                if(res.token) Fleetbo.startNotification(JSON.stringify({ title, body: content, token: res.token, image: "" }));
            }).catch(() => {});

        } catch (err) {
            setMessage({ type: 'danger', text: "Error: " + err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageConfig navbar="none" />
            
            <InsertHeader 
                onBack={()    => navigate(-1) } 
                onGallery={handleOpenGallery } 
            />

            <div className="p-3 fade-in">
                <form onSubmit={handleSubmit} className="p-2 mt-2">
                    
                    <div className="d-flex justify-content-center mb-4">
                        <div className="position-relative p-1" style={{ width: '90px', height: '90px' }}>
                            <img 
                                src={selectedImage || `https://placehold.co/100x100?text=No+Img`} 
                                className="w-100 h-100 rounded shadow-sm bg-light" 
                                style={{ objectFit: 'cover' }}
                                alt="Preview" 
                            />
                            
                            <div 
                                onClick={openCamera}
                                className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" 
                                style={{ width: '30px', height: '30px', cursor: 'pointer', opacity: 0.9 }}
                            >
                                <Camera size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="mb-1 text-secondary fs-6">Title</label>
                        <input 
                            type='text' className="form-control fs-6 form-control-lg" 
                            value={title} onChange={e => setTitle(e.target.value)} 
                            placeholder="Ex: My Project"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 text-secondary fs-6">uyewgfuygweyg</label>
                        <textarea 
                            className="form-control" rows={4} 
                            value={content} onChange={e => setContent(e.target.value)} 
                            placeholder="Enter details..."
                        />
                    </div>

                    <button className="btn btn-success w-100 py-3 fw-bold shadow-sm" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Add Item'}
                    </button>
                    
                    {message && (
                        <div className={`alert mt-3 py-2 text-center ${message.type === 'danger' ? 'alert-danger' : 'alert-success'}`}>
                            {message.text}
                        </div>
                    )}
                </form>

            </div>
        </>
    );
};
export default Insert;

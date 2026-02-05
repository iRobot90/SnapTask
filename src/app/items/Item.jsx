import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { fleetboDB } from '@fleetbo/config/fleetboConfig';
import Loader from '@fleetbo/components/common/Loader'; 
import { ArrowLeftCircle } from 'lucide-react'; 


const ItemHeader = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <div>
                <button onClick={() => Fleetbo.back()} className="btn-header text-success fs-5 fw-bold">
                    <ArrowLeftCircle/> <span className='ms-3'>Item</span>
                </button>
            </div>
        </header>
    );
};

const Item = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    
    const { id } = useParams(); 

    useEffect(() => {
        const fetchData = async (itemId) => {
            setLoading(true);
            setError("");
            
            if (!itemId) {
                setError("No item ID was provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await Fleetbo.getDoc(fleetboDB, "items", itemId);

                if (response.success && response.data) {
                    setItemData(response.data);
                } else {
                    const errorMessage = response.message || "Error fetching the document.";
                    setError(errorMessage);
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error fetching item:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData(id);

    }, [id]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className='center-container'> <Loader /></div>
            );
        }

        if (error) { return <div className="alert alert-danger">{error}</div>;}

        if (itemData) {
            return (
                <div> <h2>{itemData.title}</h2>   <h5 className='fw-normal text-secondary'>{itemData.content}</h5> </div>
            );
        }

        return <p>No data found for this item.</p>;
    };

    return (
        <>
            <ItemHeader />
            <div className="p-3">
                {renderContent()}
            </div>
        </>
    );
};

export default Item;

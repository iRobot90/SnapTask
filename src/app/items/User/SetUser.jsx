import React, { useState } from 'react';
import { motion } from "framer-motion";
import { fleetboDB, useAuth, PageConfig } from '@fleetbo';


const SetUser = () => {

    const [loadingLog, setLoadingLog]                  = useState(false); 
    const [formData, setFormData]                      = useState({ username: "" });
    const  db                                          = "users";
    
    const {sessionData, isLoading: isAuthLoading, }    = useAuth();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const register = async (e) => {
        e.preventDefault();
        if (loadingLog) return;
        setLoadingLog(true);
        try {
            const result = await Fleetbo.addWithUserId(fleetboDB, db, JSON.stringify(formData));
            if (result && result.success) {
                Fleetbo.back();
            } else {
                console.error("Registration failed on Fleetbo engine.");
            }
        } catch (error) {
            console.error(`Register error: ${error.message}`);
        } finally {
            setLoadingLog(false);
        }
    };


    return (
        <>
            <PageConfig navbar="none" />
            <motion.div
                transition={{ duration: 0.4 }}
                className="p-3 vh-100 d-flex align-items-center justify-content-center"
            >
                <div className="">
                {isAuthLoading ? (
                        <></>
                    ) : sessionData ? (
                        <>
                            <div className="text-container">
                                <div className='row mt-4'>
                                    <div >
                                        <i className="fa-solid fa-user-astronaut fa-3x text-success mb-3"></i>
                                        <h4 className="fw-bold">Choose your username</h4>
                                        <p className="text-muted">This name will be visible to other users.</p>
                                    </div>
                                    <form className='mt-3' onSubmit={register} >
                                        <div className='mb-3'>
                                            <label className='form-group label'>Username</label>
                                            <input 
                                                className='form-control mt-2 p-2' 
                                                name="username" type="text" 
                                                value={formData.username} onChange={handleChange} 
                                                placeholder='' required />
                                        </div>
                                        <div> 
                                            <button type="submit" className="btn btn-success w-100 p-2 fs-6">
                                                {loadingLog ? "Loading..." : "Create"}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="pb-1">
                                        <button onClick={() => Fleetbo.back()} className="btn btn-link w-100 p-2 fs-6 text-secondary text-decoration-none mt-3">
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div> <p>Information not available</p> </div>
                    )}
                </div>   
            </motion.div>
        </>
    )
};

export default SetUser;

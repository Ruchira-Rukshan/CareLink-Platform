import React, { useState, useEffect, useRef } from 'react';

/**
 * Common component for uploading and previewing profile pictures.
 * Handles file selection and provides a sleek preview.
 */
const ProfilePictureUpload = ({ image, onChange, currentImage }) => {
    const fileRef = useRef();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (image instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(image);
        } else if (currentImage) {
            setPreview(`/api/v1/uploads/profile-picture/${currentImage}`);
        } else {
            setPreview(null);
        }
    }, [image, currentImage]);

    return (
        <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <div 
                onClick={() => fileRef.current.click()}
                style={{
                    width: '110px', height: '110px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.4)',
                    border: '3px solid rgba(15, 40, 25, 0.1)',
                    margin: '0 auto 0.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                }}
                onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = 'rgba(15, 40, 25, 0.3)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(15, 40, 25, 0.1)';
                }}
            >
                {preview ? (
                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.8rem', marginBottom: '2px' }}>👤</div>
                    </div>
                )}
                <div style={{ 
                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                    background: 'rgba(15, 40, 25, 0.85)', padding: '6px 0',
                    fontSize: '0.65rem', color: '#CFF971', fontWeight: 900,
                    opacity: 0, transition: 'all 0.3s ease',
                    transform: 'translateY(100%)'
                }} className="upload-overlay">CHANGE</div>
            </div>
            <input 
                type="file" 
                ref={fileRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={e => {
                    const file = e.target.files[0];
                    if (file) onChange(file);
                }} 
            />
            {image && (
                <p style={{ fontSize: '0.72rem', color: '#0F2819', fontWeight: 600, margin: '0.4rem 0 0', opacity: 0.8 }}>
                    📎 {image.name}
                </p>
            )}
            <style>{`
                div:hover .upload-overlay { 
                    opacity: 1 !important; 
                    transform: translateY(0) !important;
                }
            `}</style>
        </div>
    );
};

export default ProfilePictureUpload;

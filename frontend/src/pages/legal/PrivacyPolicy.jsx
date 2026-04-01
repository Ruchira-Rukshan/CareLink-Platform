import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0a191c', color: '#fff', padding: '4rem 5%' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{ color: '#CFF971', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Privacy Policy</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                    CareLink is committed to protecting your personal health information (PHI) with the highest level of security.
                </p>
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Data Collection</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        We collect personal identification information (Name, email address, phone number, etc.) and health-related data (Medical history, prescriptions, lab results) to provide unified healthcare management services.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. How We Use Your Data</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Your data is used specifically to coordinate appointments, maintain your digital health cabinet, and facilitate laboratory diagnostics. We never sell or share your PHI for marketing purposes.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Data Protection</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Our platform employs modern encryption standards (AES-256) for data at rest and TLS for data in transit. We also offer multi-factor authentication (2FA) for all users to enhance account security.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

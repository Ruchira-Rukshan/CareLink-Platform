import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0a191c', color: '#fff', padding: '4rem 5%' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{ color: '#CFF971', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Help Center</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Welcome to the CareLink Help Center. How can we assist you today?
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Getting Started', desc: 'Learn how to create an account and set up your profile.' },
                        { title: 'Appointments', desc: 'How to book, cancel, and manage your doctor visits.' },
                        { title: 'Lab Reports', desc: 'Viewing and downloading your laboratory results.' },
                        { title: 'Security', desc: 'Keeping your health data safe and enabling 2FA.' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ color: '#CFF971', marginBottom: '1rem' }}>{item.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;

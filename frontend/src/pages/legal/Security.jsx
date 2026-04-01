import React from 'react';
import { Link } from 'react-router-dom';

const Security = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0a191c', color: '#fff', padding: '4rem 5%' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/" style={{ color: '#CFF971', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Security & Protection</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                    At CareLink, the security of your health data is our highest priority. We use industry-leading standards to keep your information safe.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {[
                        { title: 'End-to-End Encryption', desc: 'All data transmitted between you and CareLink is encrypted using TLS.' },
                        { title: 'Secure Storage', desc: 'We use AES-256 encryption to protect your sensitive health records on our servers.' },
                        { title: 'Two-Factor Authentication', desc: 'An extra layer of security that ensures only you can access your profile.' },
                        { title: 'Access Controls', desc: 'Doctors and medical labs only see the data you specifically share with them.' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.25rem', color: '#CFF971', marginBottom: '1rem' }}>{item.title}</h3>
                            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Security;

import React from 'react';
import { Link } from 'react-router-dom';

function HeartIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--warning)', marginBottom: '1rem' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    );
}

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation */}
            <nav style={{
                padding: '1.5rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-base)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ color: 'var(--primary)' }}>
                        <HeartIcon />
                    </div>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>CareLink</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/login" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', height: '100%', color: 'var(--text-primary)', textDecoration: 'none' }}>Sign In</Link>
                    <Link to="/register" className="btn btn-primary" style={{ margin: 0 }}>Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '6rem 2rem',
                background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0, 198, 167, 0.15), transparent)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="badge badge-active animate-in" style={{ marginBottom: '1.5rem' }}>
                    🚀 The Next Generation EMR System
                </div>
                <h1 className="animate-in" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    maxWidth: '800px',
                    margin: '0 auto 1.5rem',
                    lineHeight: 1.15
                }}>
                    Connect. Manage. <span style={{ color: 'var(--primary)' }}>Heal.</span>
                </h1>
                <p className="animate-in" style={{
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto 2.5rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    animationDelay: '0.1s',
                    animationFillMode: 'both'
                }}>
                    CareLink bridges the gap between patients, doctors, pharmacies, and laboratories.
                    Experience seamless healthcare management with our modern, secure platform.
                </p>
                <div className="animate-in" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <Link to="/register/patient" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginTop: 0 }}>
                        I am a Patient
                    </Link>
                    <Link to="/register/doctor" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        I am a Doctor
                    </Link>
                </div>

                {/* Decorative background gradients */}
                <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, opacity: 0.5 }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '300px', height: '300px', background: 'var(--accent-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, opacity: 0.5 }}></div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '5rem 5%', background: 'var(--bg-card)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Why choose CareLink?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>Designed to deliver an exceptional experience for everyone involved in the healthcare journey.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="stat-card" style={{ padding: '2rem', height: '100%' }}>
                        <ShieldIcon />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>Secure & Private</h3>
                        <p style={{ fontSize: '0.95rem' }}>Your medical data is encrypted and protected. Only authorized personnel have access to your personal health information.</p>
                    </div>
                    <div className="stat-card" style={{ padding: '2rem', height: '100%' }}>
                        <ActivityIcon />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>Real-time Tracking</h3>
                        <p style={{ fontSize: '0.95rem' }}>Log symptoms, track your medical history, and view your active prescriptions, all updated in real-time.</p>
                    </div>
                    <div className="stat-card" style={{ padding: '2rem', height: '100%' }}>
                        <UsersIcon />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>Unified Network</h3>
                        <p style={{ fontSize: '0.95rem' }}>Connect effortlessly with doctors, pharmacies, laboratories, and suppliers within a single, unified ecosystem.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '2rem 5%',
                background: 'var(--bg-sidebar)',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <HeartIcon />
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>CareLink</span>
                </div>
                <p style={{ fontSize: '0.9rem' }}>© {new Date().getFullYear()} CareLink Healthcare Management System. All rights reserved.</p>
            </footer>
        </div>
    );
}

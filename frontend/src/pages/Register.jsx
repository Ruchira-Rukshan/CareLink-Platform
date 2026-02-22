import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
    { key: 'patient', label: 'Patient', icon: '🧑‍⚕️', desc: 'Book appointments & manage health records', path: '/register/patient' },
    { key: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'Manage patients & write prescriptions', path: '/register/doctor' },
    { key: 'pharmacist', label: 'Pharmacist', icon: '💊', desc: 'Dispense medications & manage inventory', path: '#' },
    { key: 'supplier', label: 'Supplier', icon: '🏭', desc: 'Supply medicines to pharmacies', path: '#' },
    { key: 'admin', label: 'Admin', icon: '🛡️', desc: 'Platform administration & oversight', path: '#' },
];

export default function Register() {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        if (role.path === '#') return; // Coming soon
        navigate(role.path);
    };

    return (
        <div className="auth-page">
            <div className="auth-card wide animate-in">
                <div className="auth-logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>CareLink</span>
                </div>

                <h2>Create your account</h2>
                <p style={{ marginBottom: '0.3rem', marginTop: '0.3rem' }}>
                    Select your role to get started
                </p>

                <div className="role-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {ROLES.map((role) => (
                        <div
                            key={role.key}
                            className="role-card"
                            onClick={() => handleSelect(role)}
                            style={{
                                opacity: role.path === '#' ? 0.5 : 1,
                                cursor: role.path === '#' ? 'not-allowed' : 'pointer',
                                position: 'relative',
                            }}
                        >
                            {role.path === '#' && (
                                <span style={{
                                    position: 'absolute', top: 8, right: 8,
                                    fontSize: '0.65rem', background: 'rgba(255,169,77,0.2)',
                                    color: 'var(--warning)', padding: '2px 6px', borderRadius: '999px',
                                    fontWeight: 700, letterSpacing: '0.05em',
                                }}>
                                    SOON
                                </span>
                            )}
                            <div className="icon">{role.icon}</div>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{role.label}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                {role.desc}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="text-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

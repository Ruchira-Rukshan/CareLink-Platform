import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
    { key: 'patient', label: 'Patient', icon: '👤', desc: 'Book appointments & manage health records', path: '/register/patient' },
    { key: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'Manage patients & write prescriptions', path: '/register/doctor' },
    { key: 'supplier', label: 'Supplier', icon: '🚚', desc: 'Supply medicines & manage wholesale orders', path: '/register/supplier' },
];

export default function Register() {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        navigate(role.path);
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in" style={{ maxWidth: '600px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="auth-logo" style={{ justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>CareLink</span>
                    </div>
                </Link>

                <h2 style={{ textAlign: 'center' }}>Create your account</h2>
                <p style={{ marginBottom: '2rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    Select your role to get started
                </p>

                <div className="role-grid">
                    {ROLES.map((role) => (
                        <div
                            key={role.key}
                            className="role-card"
                            onClick={() => handleSelect(role)}
                        >
                            <div className="icon">{role.icon}</div>
                            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{role.label}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
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

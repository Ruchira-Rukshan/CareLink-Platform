import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiLoader, FiSend } from 'react-icons/fi';
import api from '../api/axios';

function HeartIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setEmailError('Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });
        setEmailError('');
        
        try {
            const res = await api.post('/v1/auth/forgot-password', { email });
            setStatus({ type: 'success', message: res.data.message });
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setStatus({ 
                type: 'error', 
                message: serverMsg || 'Unable to process your request. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="auth-logo">
                        <HeartIcon />
                        <span>CareLink</span>
                    </div>
                </Link>

                <h2>Forgot Password?</h2>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.3rem' }}>
                    Enter your email to receive a password reset link
                </p>

                {status.message && (
                    <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'}`}>
                        {status.type === 'error' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                        <span>{status.message}</span>
                    </div>
                )}

                {!status.type || status.type === 'error' ? (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-input ${emailError ? 'error' : ''}`}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                                autoComplete="email"
                            />
                            {emailError && (
                                <div className="form-error"><FiAlertCircle size={14} /> {emailError}</div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                        >
                            {loading ? (
                                <><FiLoader className="spinner" /> Sending Link...</>
                            ) : (
                                <><FiSend /> Send Reset Link</>
                            )}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Check your inbox for instructions to reset your password.
                        </p>
                        <button onClick={() => window.location.href = '/login'} className="btn btn-primary">
                            <FiArrowLeft /> Back to Login
                        </button>
                    </div>
                )}

                <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    Remember your password?{' '}
                    <Link to="/login" className="text-link" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

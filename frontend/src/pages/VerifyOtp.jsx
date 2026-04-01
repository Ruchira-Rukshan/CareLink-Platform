import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiAlertCircle, FiCheckCircle, FiLoader, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import api from '../api/axios';

function HeartIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export default function VerifyOtp() {
    const { verify2fa } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes

    useEffect(() => {
        const state = location.state;
        if (!state || !state.username) {
            navigate('/login');
            return;
        }
        setUsername(state.username);
        
        // Initial message
        setStatus({ type: 'success', message: 'A verification code has been sent to your email.' });

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [location, navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (code.length !== 6) {
            setStatus({ type: 'error', message: 'Please enter the 6-digit code.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const result = await verify2fa(username, code);
            
            // Check if user is approved (Doctors/Suppliers need admin approval)
            if (!result.token) {
                setStatus({ 
                    type: 'success', 
                    message: result.message || 'Verification successful! Your account is pending admin approval.' 
                });
                setTimeout(() => {
                    navigate('/login', { 
                        state: { message: 'Account verified! Please wait for admin approval before logging in.' } 
                    });
                }, 3000);
                return;
            }

            const { user } = result;
            setStatus({ type: 'success', message: 'Verification successful!' });
            
            setTimeout(() => {
                if (user.role === 'ADMIN') navigate('/dashboard');
                else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
                else if (user.role === 'PHARMACIST') navigate('/pharmacy/dashboard');
                else if (user.role === 'LAB_TECH') navigate('/lab/dashboard');
                else if (user.role === 'SUPPLIER') navigate('/supplier/dashboard');
                else navigate('/patient/dashboard');
            }, 1000);

        } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setStatus({ 
                type: 'error', 
                message: serverMsg || 'Verification failed. Please try again.' 
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

                <h2>Two-Step Verification</h2>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.3rem' }}>
                    Enter the code we sent to your email address.
                </p>

                {status.message && (
                    <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'}`}>
                        {status.type === 'error' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                        <span>{status.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Verification Code</span>
                            <span style={{ color: countdown < 60 ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: '600' }}>
                                Expires in {formatTime(countdown)}
                            </span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="000 000"
                            maxLength="6"
                            style={{ 
                                textAlign: 'center', 
                                fontSize: '1.5rem', 
                                letterSpacing: '8px',
                                fontWeight: '700',
                                background: 'rgba(255, 255, 255, 0.04)'
                            }}
                            value={code}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCode(val);
                                if (status.type === 'error') setStatus({ type: '', message: '' });
                            }}
                            autoFocus
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading || countdown === 0}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                        {loading ? (
                            <><FiLoader className="spinner" /> Verifying...</>
                        ) : (
                            <><FiShield /> Verify Account</>
                        )}
                    </button>
                </form>

                <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    Didn't receive a code?{' '}
                    <button 
                        onClick={() => window.location.reload()} 
                        className="text-link" 
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Resend
                    </button>
                </p>

                <Link to="/login" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%', textDecoration: 'none' }}>
                    <FiArrowLeft /> Back to Login
                </Link>
            </div>
        </div>
    );
}

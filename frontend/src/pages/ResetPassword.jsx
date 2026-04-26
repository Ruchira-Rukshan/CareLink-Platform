import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiLoader } from 'react-icons/fi';
import api from '../api/axios';

function HeartIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [fieldErrors, setFieldErrors] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryToken = new URLSearchParams(location.search).get('token');
        if (!queryToken) {
            setStatus({ type: 'error', message: 'No reset token found. Please use the link sent to your email.' });
        } else {
            setToken(queryToken);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear field error when user starts typing
        if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: '' });
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { newPassword: '', confirmPassword: '' };

        if (!form.newPassword) {
            newErrors.newPassword = 'Password is required';
            isValid = false;
        } else if (form.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await api.post('/v1/auth/reset-password', {
                token,
                newPassword: form.newPassword
            });
            setStatus({ type: 'success', message: res.data.message });
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setStatus({ 
                type: 'error', 
                message: serverMsg || 'Something went wrong. The link might be expired or invalid.' 
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

                <h2>Reset Your Password</h2>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.3rem' }}>
                    Securely update your account credentials
                </p>

                {status.message && (
                    <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'}`}>
                        {status.type === 'error' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                        <span>{status.message}</span>
                    </div>
                )}

                {token && status.type !== 'success' && (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className={`form-input ${fieldErrors.newPassword ? 'error' : ''}`}
                                    placeholder="Minimum 6 characters"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                            </div>
                            {fieldErrors.newPassword && (
                                <div className="form-error"><FiAlertCircle size={14} /> {fieldErrors.newPassword}</div>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                                placeholder="Re-enter your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            {fieldErrors.confirmPassword && (
                                <div className="form-error"><FiAlertCircle size={14} /> {fieldErrors.confirmPassword}</div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                        >
                            {loading ? (
                                <><FiLoader className="spinner" /> Updating Password...</>
                            ) : (
                                <><FiCheckCircle /> Update Password</>
                            )}
                        </button>
                    </form>
                )}

                {status.type === 'success' && (
                    <div className="text-center" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Your security has been updated. <br />
                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Redirecting to login...</span>
                        </p>
                    </div>
                )}

                {!token && (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn btn-outline" 
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        <FiArrowLeft /> Back to Login
                    </button>
                )}
            </div>
        </div>
    );
}

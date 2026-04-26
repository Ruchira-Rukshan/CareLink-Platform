import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiLoader, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function HeartIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: '' });
        if (error) setError('');
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { username: '', password: '' };

        if (!form.username) {
            newErrors.username = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) {
            newErrors.username = 'Please enter a valid email address';
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setLoading(true);
        setError('');
        try {
            const result = await login(form.username, form.password);

            if (result?.requires2fa) {
                // Navigate to Verify OTP
                navigate('/verify-otp', { state: { username: form.username } });
                return;
            }

            const { user } = result;
            if (!user) throw new Error("Authentication failed");

            const params = new URLSearchParams(location.search);
            const redirectParam = params.get('redirect');

            // Check for pending booking RESTORE first (for ALL roles)
            const pending = sessionStorage.getItem('cl_pending_booking');
            const pendingLab = sessionStorage.getItem('cl_pending_lab_booking');
            if (pending || pendingLab) {
                sessionStorage.setItem('cl_restore_booking', '1');
                navigate('/', { replace: true });
                return;
            }

            if (redirectParam === 'reviews') {
                navigate('/#reviews', { replace: true });
                return;
            }

            // Standard role-based redirects
            if (user.role === 'ADMIN') navigate('/dashboard');
            else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
            else if (user.role === 'PHARMACIST') navigate('/pharmacy/dashboard');
            else if (user.role === 'LAB_TECH') navigate('/lab/dashboard');
            else if (user.role === 'SUPPLIER') navigate('/supplier/dashboard');
            else if (user.role === 'EMERGENCY') {
                if (user.lastName === 'Responder') navigate('/ambulance/dashboard');
                else navigate('/emergency/dashboard');
            }
            else navigate('/patient/dashboard');
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setError(serverMsg || 'Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="auth-logo">
                        <HeartIcon />
                        <span>CareLink</span>
                    </div>
                </Link>

                <h2>Welcome back</h2>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.3rem' }}>
                    Sign in to your healthcare account
                </p>

                {error && (
                    <div className="alert alert-danger" style={{ animation: 'shake 0.4s ease' }}>
                        <FiAlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="username"
                            className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                            placeholder="name@example.com"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {fieldErrors.username && (
                            <div className="form-error"><FiAlertCircle size={14} /> {fieldErrors.username}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="form-label">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        {fieldErrors.password && (
                            <div className="form-error"><FiAlertCircle size={14} /> {fieldErrors.password}</div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                        {loading ? (
                            <><FiLoader className="spinner" /> Authenticating...</>
                        ) : (
                            <><FiLogIn /> Sign In</>
                        )}
                    </button>
                </form>

                <div className="divider">or</div>

                <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-link">Create account</Link>
                </p>
            </div>
        </div>
    );
}

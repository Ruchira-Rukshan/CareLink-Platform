import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Please enter your email and password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await login(form.username, form.password);
            if (user.role === 'ADMIN') navigate('/dashboard');
            else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
            else if (user.role === 'PHARMACIST') navigate('/pharmacy/dashboard');
            else if (user.role === 'LAB_TECH') navigate('/lab/dashboard');
            else navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                {/* Logo */}
                <div className="auth-logo">
                    <HeartIcon />
                    <span>CareLink</span>
                </div>

                <h2>Welcome back</h2>
                <p style={{ marginBottom: '1.5rem', marginTop: '0.3rem' }}>
                    Sign in to your healthcare account
                </p>

                {error && (
                    <div className="alert alert-error">
                        <span>⚠</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address <span className="required">*</span></label>
                        <input
                            type="email"
                            name="username"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In'}
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

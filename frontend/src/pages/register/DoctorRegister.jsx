import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const SPECIALIZATIONS = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic Surgeon', 'Pediatrician', 'Psychiatrist', 'Gynecologist',
    'Oncologist', 'Radiologist', 'Anesthesiologist', 'Endocrinologist',
    'Gastroenterologist', 'Urologist', 'Ophthalmologist', 'ENT Specialist',
    'Pulmonologist', 'Nephrologist', 'Rheumatologist', 'Other',
];

/* ─── Step Indicator ─────────────────────────────────── */
function StepIndicator({ current, steps }) {
    return (
        <div className="step-indicator">
            {steps.map((label, i) => (
                <React.Fragment key={i}>
                    <div className="step-wrapper">
                        <div className={`step-circle ${i < current ? 'done' : i === current ? 'active' : ''}`}>
                            {i < current ? '✓' : i + 1}
                        </div>
                        <span className={`step-label ${i === current ? 'active' : i < current ? 'done' : ''}`}>
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ─── Step 1: Account ────────────────────────────────── */
function Step1({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">🔐 Account & Security</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">First Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Nimal" name="firstName" value={data.firstName} onChange={onChange} />
                    {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Silva" name="lastName" value={data.lastName} onChange={onChange} />
                    {errors.lastName && <span className="form-error">⚠ {errors.lastName}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">
                    Email Address <span className="required">*</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(Used for login)</span>
                </label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="dr.nimal@hospital.lk" name="email" value={data.email} onChange={onChange} />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+94 77 123 4567" name="phone" value={data.phone} onChange={onChange} />
                {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="••••••••" name="password" value={data.password} onChange={onChange} />
                    {errors.password && <span className="form-error">⚠ {errors.password}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="••••••••" name="confirmPassword" value={data.confirmPassword} onChange={onChange} />
                    {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
                </div>
            </div>
        </>
    );
}

/* ─── Step 2: Professional Credentials ───────────────── */
function Step2({ data, onChange, errors, certificate, onCertChange }) {
    const fileRef = useRef();
    const [drag, setDrag] = useState(false);

    const handleFileChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            onCertChange(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <>
            <div className="section-title">🏥 Professional Credentials</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Medical License Number <span className="required">*</span></label>
                    <input className={`form-input ${errors.medicalLicenseNumber ? 'error' : ''}`} placeholder="SLMC-12345" name="medicalLicenseNumber" value={data.medicalLicenseNumber} onChange={onChange} />
                    {errors.medicalLicenseNumber && <span className="form-error">⚠ {errors.medicalLicenseNumber}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Years of Experience <span className="required">*</span></label>
                    <input type="number" min="0" max="60" className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`} placeholder="5" name="yearsOfExperience" value={data.yearsOfExperience} onChange={onChange} />
                    {errors.yearsOfExperience && <span className="form-error">⚠ {errors.yearsOfExperience}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Specialization <span className="required">*</span></label>
                <select className={`form-select ${errors.specialization ? 'error' : ''}`} name="specialization" value={data.specialization} onChange={onChange}>
                    <option value="">Select your specialization</option>
                    {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialization && <span className="form-error">⚠ {errors.specialization}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">
                    Qualifications <span className="required">*</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(e.g. MBBS, MD, MS)</span>
                </label>
                <input className={`form-input ${errors.qualifications ? 'error' : ''}`} placeholder="MBBS, MD (Cardiology)" name="qualifications" value={data.qualifications} onChange={onChange} />
                {errors.qualifications && <span className="form-error">⚠ {errors.qualifications}</span>}
            </div>

            {/* Certificate Upload */}
            <div className="form-group">
                <label className="form-label">
                    MBBS / Medical Certificate <span className="required">*</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(JPG, PNG, max 5MB)</span>
                </label>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files[0])} />

                {!certificate ? (
                    <div
                        className={`file-upload-area ${drag ? 'dragover' : ''}`}
                        onClick={() => fileRef.current.click()}
                        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">📄</div>
                        <p>Click to upload or drag & drop</p>
                        <span>PNG, JPG, JPEG — Maximum 5MB</span>
                    </div>
                ) : (
                    <div className="file-preview">
                        <span style={{ fontSize: '2rem' }}>🖼️</span>
                        <div className="file-preview-info">
                            <div className="file-preview-name">{certificate.name}</div>
                            <div className="file-preview-size">{formatBytes(certificate.size)}</div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => onCertChange(null)}
                            style={{ color: 'var(--danger)', fontSize: '1.2rem' }}
                        >
                            ✕
                        </button>
                    </div>
                )}
                {errors.certificate && <span className="form-error">⚠ {errors.certificate}</span>}
            </div>
        </>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
const STEPS = ['Account', 'Credentials'];

const INITIAL = {
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    medicalLicenseNumber: '', specialization: '', qualifications: '', yearsOfExperience: '',
};

export default function DoctorRegister() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL);
    const [certificate, setCertificate] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.firstName.trim()) e.firstName = 'First name is required';
            if (!form.lastName.trim()) e.lastName = 'Last name is required';
            if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
            if (!form.phone.trim()) e.phone = 'Phone number is required';
            if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        }
        if (step === 1) {
            if (!form.medicalLicenseNumber.trim()) e.medicalLicenseNumber = 'License number is required';
            if (!form.specialization) e.specialization = 'Specialization is required';
            if (!form.qualifications.trim()) e.qualifications = 'Qualifications are required';
            if (!form.yearsOfExperience) e.yearsOfExperience = 'Years of experience is required';
            if (!certificate) e.certificate = 'MBBS certificate is required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validateStep()) setStep((s) => s + 1); };
    const prevStep = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        setApiError('');
        try {
            // First register account
            await api.post('/v1/auth/register', {
                ...form,
                username: form.email,
                role: 'DOCTOR',
            });

            // Upload certificate if API endpoint available
            if (certificate) {
                try {
                    const fd = new FormData();
                    fd.append('file', certificate);
                    fd.append('email', form.email);
                    await api.post('/v1/uploads/certificate', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } catch {
                    // Non-fatal — certificate upload fails silently for now
                }
            }

            setSuccess(true);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card animate-in" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h2>Application Submitted!</h2>
                    <p style={{ margin: '0.8rem 0 0.5rem' }}>
                        Your doctor profile has been submitted for admin verification.
                    </p>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        You'll receive an email once your account is approved.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card wide animate-in">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
                    <div className="auth-logo" style={{ marginBottom: 0 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        <span style={{ fontSize: '1.1rem' }}>Dr. Registration</span>
                    </div>
                </div>

                <StepIndicator current={step} steps={STEPS} />

                {apiError && <div className="alert alert-error">⚠ {apiError}</div>}

                <div className="animate-in" key={step}>
                    {step === 0 && <Step1 data={form} onChange={handleChange} errors={errors} />}
                    {step === 1 && (
                        <Step2
                            data={form}
                            onChange={handleChange}
                            errors={errors}
                            certificate={certificate}
                            onCertChange={setCertificate}
                        />
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                    {step > 0 && (
                        <button className="btn btn-outline" onClick={prevStep} style={{ flex: 1 }}>
                            ← Back
                        </button>
                    )}
                    {step < 1 ? (
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>
                            Continue →
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                            {loading ? <><div className="spinner" /> Submitting...</> : '👨‍⚕️ Submit Application'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

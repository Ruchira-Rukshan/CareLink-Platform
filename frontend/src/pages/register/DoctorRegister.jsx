import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const SPECIALIZATIONS = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic Specialist', 'Pediatrician', 'Gastroenterologist', 'Endocrinologist',
    'Pulmonologist', 'Rheumatologist', 'ENT Specialist', 'Urologist',
    'Infectious Disease Specialist', 'Hepatologist', 'Allergist / Immunologist',
    'Psychiatrist', 'Gynecologist', 'Oncologist', 'Radiologist',
    'Anesthesiologist', 'Nephrologist', 'Ophthalmologist',
    'Proctologist / General Surgeon', 'Vascular Surgeon', 'Other'
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

/* ─── Profile Picture Upload ───────────────────────── */
function ProfilePictureUpload({ image, onChange }) {
    const fileRef = React.useRef();
    const [preview, setPreview] = React.useState(null);

    React.useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [image]);

    return (
        <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div 
                onClick={() => fileRef.current.click()}
                style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px dashed rgba(207, 249, 113, 0.4)',
                    margin: '0 auto 0.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#CFF971'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(207, 249, 113, 0.4)'}
            >
                {preview ? (
                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '2px' }}>👨‍⚕️</div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#CFF971' }}>PHOTO</div>
                    </div>
                )}
            </div>
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) onChange(file);
            }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                Upload Profile Photo
            </div>
        </div>
    );
}

/* ─── Step 1: Account ────────────────────────────────── */
function Step1({ data, onChange, errors, profilePic, onProfilePicChange }) {
    return (
        <>
            <div className="section-title">🔐 Account & Security</div>
            <ProfilePictureUpload image={profilePic} onChange={onProfilePicChange} />
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
            <div className="form-group">
                <label className="form-label">National ID / Passport Number <span className="required">*</span></label>
                <input className={`form-input ${errors.nationalId ? 'error' : ''}`} placeholder="199012345678" name="nationalId" value={data.nationalId} onChange={onChange} />
                {errors.nationalId && <span className="form-error">⚠ {errors.nationalId}</span>}
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
            <div className="form-group" style={{ 
                background: 'rgba(207, 249, 113, 0.05)', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                border: '1.5px solid rgba(207, 249, 113, 0.2)',
                marginTop: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'rgba(207, 249, 113, 0.1)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CFF971'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#CFF971', fontSize: '0.95rem' }}>
                            Mandatory Security Verification
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                            To protect medical records, an email OTP is mandatory for account activation and every subsequent sign-in.
                        </div>
                    </div>
                    <div style={{ color: '#CFF971', fontSize: '0.7rem', fontWeight: 900, background: 'rgba(207, 249, 113, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(207, 249, 113, 0.3)' }}>
                        REQUIRED
                    </div>
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
        if (file && file.type === 'application/pdf') {
            onCertChange(file);
        } else if (file) {
            alert('Please upload a PDF document.');
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(PDF ONLY, max 10MB)</span>
                </label>
                <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files[0])} />

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
                        <span>PDF Document — Maximum 10MB</span>
                    </div>
                ) : (
                    <div className="file-preview">
                        <span style={{ fontSize: '2rem' }}>📕</span>
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

            <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '16px',
                border: errors.acceptedTerms ? '1px solid rgba(255, 71, 87, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
            }}>
                <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input 
                        type="checkbox" 
                        name="acceptedTerms" 
                        checked={data.acceptedTerms} 
                        onChange={onChange}
                        style={{ 
                            marginTop: '4px',
                            width: '20px',
                            height: '20px',
                            accentColor: '#CFF971',
                            cursor: 'pointer'
                        }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                        I agree to the <Link to="/terms?type=doctor" style={{ color: '#CFF971', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(207, 249, 113, 0.3)' }}>Terms and Conditions</Link> for healthcare professionals and confirm all provided credentials are valid.
                    </span>
                </label>
                {errors.acceptedTerms && (
                    <div style={{ color: '#ff4757', fontSize: '0.78rem', marginTop: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {errors.acceptedTerms}
                    </div>
                )}
            </div>
        </>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
const STEPS = ['Account', 'Credentials'];

const INITIAL = {
    firstName: '', lastName: '', email: '', phone: '', nationalId: '', password: '', confirmPassword: '',
    medicalLicenseNumber: '', specialization: '', qualifications: '', yearsOfExperience: '',
    twoFactorEnabled: true,
    acceptedTerms: false
};

export default function DoctorRegister() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL);
    const [profilePic, setProfilePic] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Persistence
    React.useEffect(() => {
        const saved = sessionStorage.getItem('cl_doctor_reg_form');
        if (saved) {
            try { setForm(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    React.useEffect(() => {
        if (form !== INITIAL) {
            sessionStorage.setItem('cl_doctor_reg_form', JSON.stringify(form));
        }
    }, [form]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        // 1. Names: Filter out numbers
        if (name === 'firstName' || name === 'lastName') {
            value = value.replace(/[0-9]/g, '');
        }

        // 2. Phone: Filter non-numbers and limit digits to 10
        if (name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }

        // 3. National ID: Limit to 13 chars, only numbers and 'v'/'V'
        if (name === 'nationalId') {
            value = value.replace(/[^0-9vV]/g, '').slice(0, 13);
        }
        
        if (e.target.type === 'checkbox') {
            setForm({ ...form, [name]: e.target.checked });
        } else {
            setForm({ ...form, [name]: value });
        }
        
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateStep = () => {
        const e = {};
        if (step === 0) {
            if (!form.firstName.trim()) e.firstName = 'First name is required';
            if (!form.lastName.trim()) e.lastName = 'Last name is required';
            if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
            
            if (!form.phone.trim()) {
                e.phone = 'Phone number is required';
            } else if (form.phone.length !== 10) {
                e.phone = 'Phone number must be exactly 10 digits';
            }

            if (!form.nationalId.trim()) {
                e.nationalId = 'National ID is required';
            } else if (form.nationalId.length < 9) {
                e.nationalId = 'National ID is too short';
            } else if (form.nationalId.length > 13) {
                e.nationalId = 'Max 13 characters allowed';
            }

            if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        }
        if (step === 1) {
            if (!form.medicalLicenseNumber.trim()) e.medicalLicenseNumber = 'License number is required';
            if (!form.specialization) e.specialization = 'Specialization is required';
            if (!form.qualifications.trim()) e.qualifications = 'Qualifications are required';
            if (!form.yearsOfExperience) e.yearsOfExperience = 'Years of experience is required';
            if (!certificate) e.certificate = 'MBBS certificate is required';
            if (!form.acceptedTerms) e.acceptedTerms = 'You must accept the terms and conditions';
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
            const formData = new FormData();
            const requestData = {
                ...form,
                username: form.email,
                role: 'DOCTOR',
            };
            
            // Append the JSON part as a blob with correct content type
            formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
            
            // Append files the backend expects
            if (certificate) {
                formData.append('certificate', certificate);
            }
            if (profilePic) {
                formData.append('profilePic', profilePic);
            }

            const res = await api.post('/v1/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.requires2fa) {
                navigate('/verify-otp', { state: { username: form.email } });
                return;
            }

            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setApiError(msg);
            // Jump back to the relevant step based on the duplicate field
            const step0Fields = ['email', 'phone'];
            const step1Fields = ['license', 'medical license'];
            if (step0Fields.some((f) => msg.toLowerCase().includes(f))) {
                setStep(0);
            } else if (step1Fields.some((f) => msg.toLowerCase().includes(f))) {
                setStep(1);
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card animate-in" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                    {/* Glowing Shield Icon */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle, rgba(207,249,113,0.15) 0%, transparent 70%)',
                            borderRadius: '50%', transform: 'scale(1.8)'
                        }} />
                        <div style={{
                            width: '100px', height: '100px',
                            background: 'rgba(207,249,113,0.08)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(207,249,113,0.25)',
                            position: 'relative', zIndex: 1
                        }}>
                            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(207,249,113,0.5))' }}>
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" strokeWidth="2.5" />
                            </svg>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.01em' }}>Registration Successful!</h2>
                    
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Your doctor profile has been submitted and is currently <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Admin Approval</span>.<br />
                        Verification usually takes 24-48 hours. You will receive an email once your account is active.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                        <button className="btn btn-primary" onClick={() => {
                            sessionStorage.removeItem('cl_doctor_reg_form');
                            navigate('/login');
                        }} style={{ fontSize: '1.05rem', padding: '1rem', fontWeight: 700, boxShadow: '0 8px 15px rgba(207,249,113,0.2)' }}>
                            Go to My Dashboard
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            Back to Homepage
                        </button>
                    </div>
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
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <div className="auth-logo" style={{ marginBottom: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                            <span style={{ fontSize: '1.1rem' }}>Dr. Registration</span>
                        </div>
                    </Link>
                </div>

                <StepIndicator current={step} steps={STEPS} />

                {apiError && <div className="alert alert-error">⚠ {apiError}</div>}

                <div className="animate-in" key={step}>
                    {step === 0 && <Step1 data={form} onChange={handleChange} errors={errors} profilePic={profilePic} onProfilePicChange={setProfilePic} />}
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

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                    {step > 0 && (
                        <button className="btn btn-outline" onClick={prevStep} style={{ flex: 1, margin: 0, height: '52px' }}>
                            ← Back
                        </button>
                    )}
                    {step < 1 ? (
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2, margin: 0, height: '52px' }}>
                            Continue →
                        </button>
                    ) : (
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSubmit} 
                            disabled={loading || !form.acceptedTerms} 
                            style={{ 
                                flex: 2, 
                                margin: 0, 
                                height: '52px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '0.6rem',
                                opacity: !form.acceptedTerms ? 0.6 : 1,
                                cursor: !form.acceptedTerms ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? <><div className="spinner" /> Submitting...</> : <>🧑‍⚕️ Submit Application</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

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

/* ─── Step 1: Company Profile ───────────────────────── */
function Step1({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">🏢 Company Information</div>
            <div className="form-group">
                <label className="form-label">Company Name <span className="required">*</span></label>
                <input 
                    className={`form-input ${errors.companyName ? 'error' : ''}`} 
                    placeholder="MediSupply Pharma Ltd" 
                    name="companyName" 
                    value={data.companyName} 
                    onChange={onChange} 
                />
                {errors.companyName && <span className="form-error">⚠ {errors.companyName}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Business Registration ID <span className="required">*</span></label>
                <input 
                    className={`form-input ${errors.companyRegId ? 'error' : ''}`} 
                    placeholder="BR-123456" 
                    name="companyRegId" 
                    value={data.companyRegId} 
                    onChange={onChange} 
                />
                {errors.companyRegId && <span className="form-error">⚠ {errors.companyRegId}</span>}
            </div>
        </>
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
                        <div style={{ fontSize: '1.8rem', marginBottom: '2px' }}>👤</div>
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

/* ─── Step 2: Account & Contact ──────────────────────── */
function Step2({ data, onChange, errors, profilePic, onProfilePicChange }) {
    return (
        <>
            <div className="section-title">👤 Contact Person</div>
            <ProfilePictureUpload image={profilePic} onChange={onProfilePicChange} />
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">First Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Anura" name="firstName" value={data.firstName} onChange={onChange} />
                    {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Kumara" name="lastName" value={data.lastName} onChange={onChange} />
                    {errors.lastName && <span className="form-error">⚠ {errors.lastName}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Business Email <span className="required">*</span></label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="anura@medisupply.com" name="email" value={data.email} onChange={onChange} />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Phone Line <span className="required">*</span></label>
                <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+94 77 111 2222" name="phone" value={data.phone} onChange={onChange} />
                {errors.phone && <span className="form-error">⚠ {errors.phone}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">National ID / Passport Number <span className="required">*</span></label>
                <input className={`form-input ${errors.nationalId ? 'error' : ''}`} placeholder="199012345678" name="nationalId" value={data.nationalId} onChange={onChange} />
                {errors.nationalId && <span className="form-error">⚠ {errors.nationalId}</span>}
            </div>

            <div className="section-title">🔐 Security</div>
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
                            Required Business Verification
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                            To verify your vendor credentials, a one-time passcode (OTP) via email is required during setup.
                        </div>
                    </div>
                    <div style={{ color: '#CFF971', fontSize: '0.7rem', fontWeight: 900, background: 'rgba(207, 249, 113, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(207, 249, 113, 0.3)' }}>
                        REQUIRED
                    </div>
                </div>
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
                        I agree to the <Link to="/terms?type=supplier" style={{ color: '#CFF971', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(207, 249, 113, 0.3)' }}>Business Terms and Conditions</Link> for CareLink vendors and confirm my business registry is active.
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

const STEPS = ['Company', 'Identity'];

export default function SupplierRegister() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        companyName: '',
        companyRegId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationalId: '',
        password: '',
        confirmPassword: '',
        twoFactorEnabled: true,
        acceptedTerms: false,
    });
    const [profilePic, setProfilePic] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState(false);

    // Persistence
    React.useEffect(() => {
        const saved = sessionStorage.getItem('cl_supplier_reg_form');
        if (saved) {
            try { setForm(JSON.parse(saved)); } catch (e) {}
        }
    }, []);

    React.useEffect(() => {
        const isDefault = form.companyName === '' && form.email === '';
        if (!isDefault) {
            sessionStorage.setItem('cl_supplier_reg_form', JSON.stringify(form));
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
            if (!form.companyName.trim()) e.companyName = 'Company name is required';
            if (!form.companyRegId.trim()) e.companyRegId = 'Registration ID is required';
        } else {
            if (!form.firstName.trim()) e.firstName = 'First name is required';
            if (!form.lastName.trim()) e.lastName = 'Last name is required';
            if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
            
            if (!form.phone.trim()) {
                e.phone = 'Phone line is required';
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

            if (form.password.length < 8) e.password = 'Min. 8 characters';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Do not match';
            if (!form.acceptedTerms) e.acceptedTerms = 'You must accept terms';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validateStep()) setStep(1); };
    const prevStep = () => setStep(0);

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        setApiError('');
        try {
            const formData = new FormData();
            const requestData = {
                ...form,
                username: form.email,
                role: 'SUPPLIER'
            };
            
            formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
            
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
            setApiError(err.response?.data?.message || 'Registration failed.');
            if (err.response?.data?.message?.toLowerCase().includes('company') || err.response?.data?.message?.toLowerCase().includes('registration')) {
                setStep(0);
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

                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Registration Complete!</h2>
                    
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Your vendor profile has been submitted and is currently <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Admin Approval</span>.<br />
                        Our team will verify your business details within 48 hours.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                        <button className="btn btn-primary" onClick={() => {
                            sessionStorage.removeItem('cl_supplier_reg_form');
                            navigate('/login');
                        }} style={{ fontSize: '1.05rem', padding: '1rem', fontWeight: 700, boxShadow: '0 8px 15px rgba(207,249,113,0.2)' }}>
                            Go to Sign In
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                    <Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
                    <div className="auth-logo" style={{ marginBottom: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Vendor Portal</span>
                    </div>
                </div>

                <StepIndicator current={step} steps={STEPS} />

                {apiError && <div className="alert alert-error">⚠ {apiError}</div>}

                <div className="animate-in" key={step} style={{ marginTop: '1.5rem' }}>
                    {step === 0 ? <Step1 data={form} onChange={handleChange} errors={errors} /> : <Step2 data={form} onChange={handleChange} errors={errors} profilePic={profilePic} onProfilePicChange={setProfilePic} />}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', alignItems: 'center' }}>
                    {step > 0 && (
                        <button className="btn btn-outline" onClick={prevStep} style={{ flex: 1, margin: 0, height: '52px' }}>
                            ← Back
                        </button>
                    )}
                    {step === 0 ? (
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
                                height: '52px',
                                margin: 0,
                                opacity: !form.acceptedTerms ? 0.6 : 1,
                                cursor: !form.acceptedTerms ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Processing...' : '📦 Register as Vendor'}
                        </button>
                    )}
                </div>

                <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Already have a vendor account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

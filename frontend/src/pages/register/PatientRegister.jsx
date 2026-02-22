import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
                    {i < steps.length - 1 && (
                        <div className={`step-line ${i < current ? 'done' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ─── Step 1: Account & Security ─────────────────────── */
function Step1({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">🔐 Account & Security</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">First Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Kamal" name="firstName" value={data.firstName} onChange={onChange} />
                    {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Perera" name="lastName" value={data.lastName} onChange={onChange} />
                    {errors.lastName && <span className="form-error">⚠ {errors.lastName}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="kamal@email.com" name="email" value={data.email} onChange={onChange} />
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
        </>
    );
}

/* ─── Step 2: Demographics ───────────────────────────── */
function Step2({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">👤 Basic Demographics</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Date of Birth <span className="required">*</span></label>
                    <input type="date" className={`form-input ${errors.dob ? 'error' : ''}`} name="dob" value={data.dob} onChange={onChange} max={new Date().toISOString().split('T')[0]} />
                    {errors.dob && <span className="form-error">⚠ {errors.dob}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Gender / Biological Sex <span className="required">*</span></label>
                    <select className={`form-select ${errors.gender ? 'error' : ''}`} name="gender" value={data.gender} onChange={onChange}>
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other / Prefer not to say</option>
                    </select>
                    {errors.gender && <span className="form-error">⚠ {errors.gender}</span>}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Residential Address <span className="required">*</span></label>
                <textarea
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="123 Main Street, Colombo 03, Sri Lanka"
                    name="address"
                    value={data.address}
                    onChange={onChange}
                    rows={3}
                    style={{ resize: 'vertical' }}
                />
                {errors.address && <span className="form-error">⚠ {errors.address}</span>}
            </div>
        </>
    );
}

/* ─── Step 3: Medical Baseline ───────────────────────── */
function Step3({ data, onChange, errors }) {
    return (
        <>
            <div className="section-title">🩺 Initial Medical Baseline</div>
            <div className="form-group">
                <label className="form-label">Blood Group <span className="required">*</span></label>
                <select className={`form-select ${errors.bloodGroup ? 'error' : ''}`} name="bloodGroup" value={data.bloodGroup} onChange={onChange}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <span className="form-error">⚠ {errors.bloodGroup}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                    className="form-input"
                    placeholder="e.g. Penicillin, Peanuts (leave blank if none)"
                    name="allergies"
                    value={data.allergies}
                    onChange={onChange}
                />
            </div>
            <div className="section-title" style={{ marginTop: '1rem' }}>🆘 Emergency Contact</div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Contact Name <span className="required">*</span></label>
                    <input className={`form-input ${errors.emergencyContactName ? 'error' : ''}`} placeholder="Saman Perera" name="emergencyContactName" value={data.emergencyContactName} onChange={onChange} />
                    {errors.emergencyContactName && <span className="form-error">⚠ {errors.emergencyContactName}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Contact Phone <span className="required">*</span></label>
                    <input type="tel" className={`form-input ${errors.emergencyContactPhone ? 'error' : ''}`} placeholder="+94 71 987 6543" name="emergencyContactPhone" value={data.emergencyContactPhone} onChange={onChange} />
                    {errors.emergencyContactPhone && <span className="form-error">⚠ {errors.emergencyContactPhone}</span>}
                </div>
            </div>
        </>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
const STEPS = ['Account', 'Demographics', 'Medical Info'];

const INITIAL = {
    firstName: '', lastName: '', email: '', phone: '', nationalId: '',
    password: '', confirmPassword: '',
    dob: '', gender: '', address: '',
    bloodGroup: '', allergies: '', emergencyContactName: '', emergencyContactPhone: '',
};

export default function PatientRegister() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL);
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
            if (!form.nationalId.trim()) e.nationalId = 'National ID is required';
            if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        }
        if (step === 1) {
            if (!form.dob) e.dob = 'Date of birth is required';
            if (!form.gender) e.gender = 'Gender is required';
            if (!form.address.trim()) e.address = 'Address is required';
        }
        if (step === 2) {
            if (!form.bloodGroup) e.bloodGroup = 'Blood group is required';
            if (!form.emergencyContactName.trim()) e.emergencyContactName = 'Emergency contact name is required';
            if (!form.emergencyContactPhone.trim()) e.emergencyContactPhone = 'Emergency contact phone is required';
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
            await api.post('/v1/auth/register', {
                ...form,
                username: form.email,
                role: 'PATIENT',
            });
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
                    <h2>Registration Successful!</h2>
                    <p style={{ margin: '0.8rem 0 1.5rem' }}>
                        Your patient account has been created. You can now sign in to access CareLink.
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
                        <span style={{ fontSize: '1.1rem' }}>Patient Registration</span>
                    </div>
                </div>

                <StepIndicator current={step} steps={STEPS} />

                {apiError && <div className="alert alert-error">⚠ {apiError}</div>}

                {/* Form Steps */}
                <div className="animate-in" key={step}>
                    {step === 0 && <Step1 data={form} onChange={handleChange} errors={errors} />}
                    {step === 1 && <Step2 data={form} onChange={handleChange} errors={errors} />}
                    {step === 2 && <Step3 data={form} onChange={handleChange} errors={errors} />}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                    {step > 0 && (
                        <button className="btn btn-outline" onClick={prevStep} style={{ flex: 1 }}>
                            ← Back
                        </button>
                    )}
                    {step < 2 ? (
                        <button className="btn btn-primary" onClick={nextStep} style={{ flex: 2 }}>
                            Continue →
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                            {loading ? <><div className="spinner" /> Creating Account...</> : '🏥 Create Patient Account'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

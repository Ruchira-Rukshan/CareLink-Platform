import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

function StarIcon({ filled, style }) {
    return (
        <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill={filled ? "#CFF971" : "none"}
            stroke={filled ? "#CFF971" : "rgba(255,255,255,0.4)"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={style}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

export default function DoctorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Initialize with state if available
    const [doctor, setDoctor] = useState(location.state?.doctor || null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(!location.state?.doctor);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                if (!doctor) setLoading(true);
                
                // Fetch reviews (public)
                const revPromise = axios.get(`${API}/v1/doctor-reviews/doctor/${id}`).catch(() => ({ data: [] }));
                
                // If we don't have doctor data from state, fetch it
                let docPromise;
                if (!doctor) {
                    docPromise = axios.get(`${API}/v1/schedules/doctors`).then(res => {
                        const found = res.data.find(d => d.id === parseInt(id) || d.id === id);
                        if (!found) throw new Error('Doctor not found');
                        return { data: found };
                    });
                } else {
                    docPromise = Promise.resolve({ data: doctor });
                }

                const [docRes, revRes] = await Promise.all([docPromise, revPromise]);

                setDoctor(docRes.data);
                setReviews(revRes.data || []);
                setError('');
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                if (!doctor) setError('Failed to load doctor profile. The doctor may no longer be available.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, doctor]);

    if (loading) {
        return (
            <div className="auth-page">
                <div className="spinner" style={{ width: '40px', height: '40px' }} />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="auth-page">
                <div className="auth-card text-center">
                    <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Oops!</h2>
                    <p style={{ marginBottom: '2rem' }}>{error || 'Doctor profile not found.'}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '5vh', paddingBottom: '5vh', overflowY: 'auto' }}>
            <div className="auth-card" style={{ maxWidth: '900px', width: '95%', margin: '0 auto' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.6rem 1.2rem', borderRadius: '12px', cursor: 'pointer', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--primary)';
                        e.currentTarget.style.color = '#0F2819';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(207, 249, 113, 0.3)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    ← Back to Doctors
                </button>

                {/* Profile Header Block */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{ 
                        width: '180px', height: '180px', borderRadius: '50%', 
                        background: 'var(--bg-input)', margin: '0 auto 1.8rem',
                        overflow: 'hidden', border: '5px solid var(--primary-glow)',
                        boxShadow: '0 0 50px var(--primary-glow)',
                        position: 'relative'
                    }}>
                        {doctor.profilePicturePath ? (
                            <img 
                                src={`${API}/v1/uploads/profile-picture/${doctor.profilePicturePath}`} 
                                alt={doctor.name || `${doctor.firstName} ${doctor.lastName}`} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--primary)', fontWeight: 800, background: 'linear-gradient(135deg, rgba(207,249,113,0.1), rgba(26,176,136,0.1))' }}>
                                {(doctor.name || doctor.firstName || 'D').charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '0.6rem', fontWeight: 800 }}>
                        {doctor.name || `Dr. ${doctor.firstName} ${doctor.lastName}`}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 700, padding: '0.4rem 1.2rem', background: 'var(--primary-glow)', borderRadius: '30px' }}>
                            {doctor.specialization}
                        </span>
                        {reviews.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem' }}>
                                <StarIcon filled={true} style={{ width: '20px', height: '20px' }} />
                                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} 
                                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div style={{ padding: '2rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ opacity: 0.7 }}>👨‍⚕️</span> Professional Profile
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualifications</label>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '0.2rem' }}>{doctor.qualifications || 'Comprehensive Medical Training'}</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</label>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '0.2rem' }}>{doctor.yearsOfExperience || '10+'} Years of Dedicated Practice</div>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</label>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '0.2rem' }}>{doctor.email || 'Contact via CareLink Support'}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '2rem', background: 'linear-gradient(145deg, var(--bg-input), rgba(207,249,113,0.03))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--primary-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h3 style={{ marginBottom: '0.8rem', color: '#fff', fontSize: '1.4rem' }}>Ready to Consultation?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Dr. {doctor.lastName || (doctor.name ? doctor.name.split(' ').pop() : 'Doctor')} is currently accepting new appointments.
                        </p>
                        <button 
                            className="btn btn-primary" 
                            style={{ margin: 0, width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            onClick={() => {
                                // Save selected doctor intended for landing page booking wizard
                                sessionStorage.setItem('cl_selected_doctor', JSON.stringify({ id: doctor.id, name: doctor.name || `${doctor.firstName} ${doctor.lastName}`, specialization: doctor.specialization }));
                                navigate('/');
                                setTimeout(() => {
                                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                                }, 300);
                            }}
                        >
                            Confirm Appointment Now
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{ marginTop: '5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Patient Feedback</h2>
                        <div style={{ background: 'var(--bg-input)', padding: '0.5rem 1.2rem', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {reviews.length} total reviews
                        </div>
                    </div>

                    {reviews.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>💬</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No patient evaluations have been submitted yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.map((rev, idx) => (
                                <div key={idx} className="card-hover" style={{ padding: '2rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                                                {rev.patientName.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>{rev.patientName}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < rev.rating} style={{ width: '18px', height: '18px' }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7, paddingLeft: '3.3rem' }}>
                                        "{rev.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

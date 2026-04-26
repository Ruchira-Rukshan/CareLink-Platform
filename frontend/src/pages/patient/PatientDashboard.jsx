import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import html2pdf from 'html2pdf.js';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend,
    LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar
} from 'recharts';

function HeartIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    );
}

function FileTextIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    );
}

function FlaskIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3v15.82a2 2 0 0 0 1.11 1.79l.89.44a2 2 0 0 0 1.79 0l.89-.44A2 2 0 0 0 15 18.82V3" />
            <path d="M7 3h10" />
            <path d="M9 11h6" />
        </svg>
    );
}

function LogOutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    );
}

function ChartBarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
            <line x1="2" y1="20" x2="22" y2="20"></line>
        </svg>
    );
}

function PillIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
            <path d="m8.5 8.5 7 7"></path>
        </svg>
    );
}

function ClipboardCheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <path d="m9 14 2 2 4-4"></path>
        </svg>
    );
}

const QuickActionButton = ({ icon, label, onClick }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', flex: 1, minWidth: '95px', transition: 'all 0.3s' }} 
         onClick={onClick}
         onMouseEnter={e => {
             e.currentTarget.style.transform = 'translateY(-4px)';
             e.currentTarget.children[0].style.boxShadow = '0 6px 15px rgba(207, 249, 113, 0.4)';
         }}
         onMouseLeave={e => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.children[0].style.boxShadow = '0 3px 8px rgba(207, 249, 113, 0.2)';
         }}>
        <div style={{ width: '75px', height: '75px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a2e0e', transition: 'all 0.3s cubic-bezier(0.2,0.8,0.2,1)', background: '#CFF971', boxShadow: '0 3px 8px rgba(207, 249, 113, 0.2)' }}>
            <div style={{ transform: 'scale(1.4)' }}>{icon}</div>
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textAlign: 'center', color: '#4b5563', textTransform: 'uppercase', lineHeight: 1.3, letterSpacing: '0.02em', maxWidth: '100px' }}>
            {label}
        </div>
    </div>
);

const SOSButton = () => {
    const [sosStatus, setSosStatus] = useState('idle'); // idle, countdown, sending, sent
    const [timer, setTimer] = useState(3);

    useEffect(() => {
        let timeout;
        if (sosStatus === 'countdown') {
            if (timer > 0) {
                timeout = setTimeout(() => setTimer(t => t - 1), 1000);
            } else {
                triggerSOS();
            }
        }
        return () => clearTimeout(timeout);
    }, [sosStatus, timer]);

    const triggerSOS = async () => {
        setSosStatus('sending');
        
        const sendAlert = async (lat, lng) => {
            try {
                await api.post('/v1/emergency/panic', { latitude: lat, longitude: lng });
                setSosStatus('sent');
                setTimeout(() => setSosStatus('idle'), 6000);
            } catch (error) {
                console.error('SOS API failed', error);
                setSosStatus('idle');
                alert("SOS Alert failed to send. An unexpected error occurred: " + (error.response?.data?.message || error.message || "Please call emergency services directly."));
            }
        };

        if (!navigator.geolocation) {
            console.warn('Geolocation not supported, using fallback location');
            await sendAlert(6.9271, 79.8612); // Fallback: Colombo
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                sendAlert(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.warn('Geolocation failed, sending alert with fallback location', err);
                sendAlert(6.9271, 79.8612); // Fallback location if user denies/timeout
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const startCountdown = () => {
        setTimer(3);
        setSosStatus('countdown');
    };

    const cancelSOS = () => {
        setSosStatus('idle');
    };

    return (
        <div style={{ position: 'fixed', bottom: '2.5rem', left: '285px', zIndex: 9999 }}>
            {sosStatus === 'idle' && (
                <button 
                    onClick={startCountdown}
                    className="sos-pulse-btn"
                    title="EMERGENCY SOS"
                    style={{ 
                        width: '74px', height: '74px', borderRadius: '50%', background: '#ff4757', color: '#fff', border: '5px solid rgba(255,255,255,0.2)', 
                        fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 30px rgba(255, 71, 87, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none'
                    }}
                >
                    SOS
                </button>
            )}
            
            {sosStatus === 'countdown' && (
                <div style={{ background: '#ff4757', padding: '1.2rem 1.8rem', borderRadius: '24px', color: '#fff', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', minWidth: '200px', animation: 'fadeInScale 0.3s ease' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>TRIGGERING HELP...</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, margin: '0.4rem 0', lineHeight: 1 }}>{timer}</div>
                    <button onClick={cancelSOS} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>CANCEL</button>
                </div>
            )}

            {sosStatus === 'sending' && (
                <div style={{ background: '#ff4757', padding: '1.4rem', borderRadius: '24px', color: '#fff', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="spinner" style={{ borderColor: '#fff', borderTopColor: 'transparent', width: '28px', height: '28px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>SENDING ALERTS...</div>
                </div>
            )}

            {sosStatus === 'sent' && (
                <div style={{ background: '#2ed573', padding: '1.4rem 2rem', borderRadius: '24px', color: '#fff', textAlign: 'center', boxShadow: '0 12px 40px rgba(46, 213, 115, 0.25)', animation: 'fadeInScale 0.3s ease' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🚨</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900 }}>HELP IS ON THE WAY</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '0.2rem' }}>Response team notified.</div>
                </div>
            )}
        </div>
    );
};

function AnalyticsView({ appointments, labReports }) {
    const getVisitsTrend = () => {
        const months = [...Array(6)].map((_, i) => {
            const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
            return { month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), count: 0 };
        });
        
        const allVisits = [...appointments, ...labReports.map(r => ({ appointmentDate: r.labSlot?.testTime }))];
        allVisits.forEach(v => {
            if (v.appointmentDate) {
                const date = new Date(v.appointmentDate);
                const match = months.find(m => m.month === date.toLocaleString('default', { month: 'short' }) && m.year === date.getFullYear());
                if (match) match.count++;
            }
        });
        return months;
    };

    const getServiceBreakdown = () => {
        return [
            { name: 'Consultations', value: appointments.length },
            { name: 'Lab Tests', value: labReports.length }
        ];
    };

    const getStatusDistribution = () => {
        const statuses = { 'Completed': 0, 'Pending/Scheduled': 0, 'Cancelled': 0 };
        
        appointments.forEach(a => {
            if (a.status === 'CONFIRMED' || a.status === 'CONFIRMED_PAID') statuses['Pending/Scheduled']++;
            else if (a.status === 'CANCELLED') statuses['Cancelled']++;
            else statuses['Completed']++; 
        });

        labReports.forEach(r => {
            if (r.status === 'CANCELLED') statuses['Cancelled']++;
            else if (r.status === 'COMPLETED') statuses['Completed']++;
            else statuses['Pending/Scheduled']++;
        });

        return [
            { name: 'Completed', value: statuses['Completed'] },
            { name: 'Scheduled', value: statuses['Pending/Scheduled'] },
            { name: 'Cancelled', value: statuses['Cancelled'] }
        ].filter(s => s.value > 0);
    };

    const trendData = getVisitsTrend();
    const serviceData = getServiceBreakdown();
    const statusData = getStatusDistribution();
    
    const COLORS = ['#10b981', '#3b82f6'];
    const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']; 

    return (
        <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Visits History (6 Months)</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="count" name="Visits" stroke="#00C6A7" strokeWidth={3} dot={{ r: 4, fill: '#00C6A7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Services Breakdown</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {serviceData.map((e, index) => <Cell key={index} fill={COLORS[index]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Record Status Overview</h3>
                <div style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="45%" innerRadius="55%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                                <RechartsLegend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No data available</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PatientDashboard() {
    const { user, loading, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();
    
    // Doctor review state
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState({ appointmentId: null, rating: 5, comment: '' });

    const handleLeaveReview = (appt) => {
        setReviewData({ appointmentId: appt.id, rating: 5, comment: '' });
        setReviewModalOpen(true);
    };

    const submitDoctorReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment.trim()) return;
        try {
            await api.post('/doctor-reviews', reviewData);
            setReviewModalOpen(false);
            // Update local state to hide button
            setAppointments(appointments.map(a => a.id === reviewData.appointmentId ? { ...a, reviewed: true } : a));
            alert("Review submitted successfully! Thank you for your feedback.");
        } catch (error) {
            console.error('Failed to submit review', error);
            alert(error.response?.data?.message || 'Failed to submit review');
        }
    };

    // Support for direct links like /patient/dashboard?tab=history
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab && ['dashboard', 'appointments', 'lab', 'symptom-log', 'prescriptions', 'history', 'analytics'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [editForm, setEditForm] = useState({
        phone: '', address: '', allergies: '',
        emergencyContactName: '', emergencyContactPhone: '',
        twoFactorEnabled: false
    });
    const [saving, setSaving] = useState(false);
    const [profileImg, setProfileImg] = useState(null);
    const [labReports, setLabReports] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paidAppt, setPaidAppt] = useState(null);
    const [symptomLogs, setSymptomLogs] = useState([]);

    // Multi-step booking wizard state
    const [bookingStep, setBookingStep] = useState(0); // 0=closed, 1=select test, 2=prep popup, 4=slot, 5=confirm, 6=booked
    const [wizardTest, setWizardTest] = useState(null);
    const [wizardSlot, setWizardSlot] = useState(null);
    const [wizardResult, setWizardResult] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Group slots by date for the calendar
    const slotsByDate = availableSlots.reduce((acc, s) => {
        const d = new Date(s.testTime).toISOString().split('T')[0];
        if (!acc[d]) acc[d] = [];
        acc[d].push(s);
        return acc;
    }, {});
    const availableDates = Object.keys(slotsByDate);
    const [selectedDate, setSelectedDate] = useState(null);

    // Load existing user data into form
    useEffect(() => {
        if (user) {
            setEditForm({
                phone: user.phone || '',
                address: user.address || '',
                allergies: user.allergies || '',
                emergencyContactName: user.emergencyContactName || '',
                emergencyContactPhone: user.emergencyContactPhone || '',
                twoFactorEnabled: user.twoFactorEnabled || false
            });
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'appointments') {
            fetchAppointments();
        } else if (activeTab === 'lab') {
            fetchLabData();
        } else if (activeTab === 'history' || activeTab === 'analytics') {
            fetchAppointments();
            fetchLabData();
            fetchPrescriptions();
        } else if (activeTab === 'prescriptions') {
            fetchPrescriptions();
        } else if (activeTab === 'symptom-log' || activeTab === 'dashboard') {
            fetchSymptomLogs();
        }
    }, [activeTab]);

    const fetchSymptomLogs = async () => {
        try {
            const res = await api.get('/v1/symptoms/logs');
            setSymptomLogs(res.data);
        } catch (error) {
            console.error('Failed to fetch symptom logs', error);
        }
    };

    const fetchPrescriptions = async () => {
        try {
            const res = await api.get('/v1/prescriptions/me/received');
            setPrescriptions(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchAppointments = async () => {
        try { const r = await api.get('/v1/appointments/me'); setAppointments(r.data); }
        catch (e) { console.error(e); }
    };

    const handleConfirmAppointment = async (appt) => {
        try {
            // Step 1: Secure Hash Generation
            const orderId = `APT-${appt.id}-${Date.now()}`;
            const amount = 2000.00;
            const res = await api.post('/v1/appointments/payhere-hash', {
                orderId: orderId,
                amount: amount,
                currency: 'LKR'
            });
            const { merchantId, hash, amount: formattedAmount } = res.data;

            // Load PayHere script dynamically if not loaded
            if (!window.payhere) {
                const script = document.createElement('script');
                script.src = 'https://www.payhere.lk/lib/payhere.js';
                // Wait for script to load
                await new Promise((resolve) => {
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            }

            // Step 3: Callbacks
            window.payhere.onCompleted = async function onCompleted(orderId) {
                try {
                    await api.patch(`/v1/appointments/${appt.id}/paid`);
                    setPaidAppt(appt);
                    setPaymentSuccess(true);
                    fetchAppointments();
                } catch (err) {
                    alert('Payment received but failed to update status. Please contact support.');
                }
            };
            window.payhere.onDismissed = function onDismissed() {
                alert('Payment cancelled by user. Appointment not confirmed.');
            };
            window.payhere.onError = function onError(error) {
                alert('An error occurred. Please try again. \r\n' + error);
            };

            // Step 2: Initialize PayHere Checkout
            const payment = {
                sandbox: true,
                merchant_id: merchantId,
                return_url: undefined,
                cancel_url: undefined,
                notify_url: 'http://sample.com/notify',
                order_id: orderId,
                items: "Appointment Booking Fee",
                amount: amount,
                currency: 'LKR',
                hash: hash,
                first_name: user?.firstName || "Patient",
                last_name: user?.lastName || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
                city: "Colombo",
                country: "Sri Lanka",
            };
            window.payhere.startPayment(payment);

        } catch (err) {
            console.error('Payment Error:', err);
            alert("Could not process payment initialization.");
        }
    };

    const handleCancelAppointment = async (appt) => {
        const appointmentTime = new Date(appt.appointmentDate);
        const currentTime = new Date();
        const diffInMs = appointmentTime - currentTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        let confirmMsg = "";
        if (diffInHours > 24) {
            confirmMsg = `Are you sure you want to cancel? You are cancelling ${Math.round(diffInHours)} hours before the appointment, so you will receive a 100% full refund.`;
        } else {
            confirmMsg = `Are you sure you want to cancel? You are cancelling within 24 hours of your appointment (${Math.round(diffInHours)} hours remaining), so a 20% cancellation fee will apply to your refund.`;
        }

        if (window.confirm(confirmMsg)) {
            try {
                // 1. Notify Backend
                await api.patch(`/v1/appointments/${appt.id}/cancel`);
                
                // 2. Notify AI Service to send emails
                try {
                    await axios.put(`http://localhost:8000/api/appointments/${appt.id}/cancel`);
                } catch (emailErr) {
                    console.error('Email Service Error:', emailErr);
                }

                // Update local state instantly
                setAppointments(prev => prev.map(a => 
                    a.id === appt.id ? { ...a, status: 'CANCELLED' } : a
                ));
            } catch (error) {
                console.error('Cancellation Error:', error);
                alert("Failed to cancel appointment. Please try again.");
            }
        }
    };

    const handleCancelLabBooking = async (report) => {
        const appointmentTime = new Date(report.labSlot?.testTime);
        const currentTime = new Date();
        const diffInMs = appointmentTime - currentTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        // Standard refund policy message for lab tests too
        let confirmMsg = "";
        if (diffInHours > 24) {
            confirmMsg = `Are you sure you want to cancel this lab test? You are cancelling ${Math.round(diffInHours)} hours before the slot, so a full refund will be initiated.`;
        } else if (diffInHours > 0) {
            confirmMsg = `Are you sure you want to cancel? You are cancelling within 24 hours (${Math.round(diffInHours)} hours remaining), so a 20% processing fee will apply.`;
        } else {
            confirmMsg = `Are you sure you want to cancel this booking?`;
        }

        if (window.confirm(confirmMsg)) {
            try {
                // 1. Call Backend to delete/cancel
                await api.delete(`/v1/laboratory/reports/${report.id}/cancel`);
                
                // Note: The backend LaboratoryService.deleteReport(id) already sends the cancellation emails.
                // But for consistency with doctor appointments, we can also ping the AI service if there are additional AI-driven logic steps required.
                // Assuming backend is enough as per our previous setup.

                // Update local state
                setLabReports(prev => prev.filter(r => r.id !== report.id));
                alert("Lab booking cancelled successfully.");
            } catch (error) {
                console.error('Lab Cancellation Error:', error);
                alert("Failed to cancel lab booking: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const fetchLabData = async () => {
        try {
            const [reportsRes, slotsRes, testsRes] = await Promise.all([
                api.get('/v1/lab-reports/my'),
                api.get('/v1/lab-slots/available'),
                api.get('/v1/laboratory/tests')
            ]);
            setLabReports(reportsRes.data);
            setAvailableSlots(slotsRes.data);
            setLabTests(testsRes.data);
        } catch (error) {
            console.error('Failed to fetch lab data', error);
        }
    };

    const startBooking = () => {
        setWizardTest(null);
        setWizardSlot(null);
        setWizardResult(null);
        setSelectedDate(null);
        setBookingStep(1);
    };

    const handleConfirmBooking = async () => {
        setBookingLoading(true);
        try {
            const res = await api.post('/v1/laboratory/book', {
                testId: wizardTest.id,
                slotId: wizardSlot.id
            });
            setWizardResult(res.data);
            setBookingStep(6);
            fetchLabData();
        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.message || 'Please try again.'));
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // 1. Upload Profile Picture if selected
            if (profileImg) {
                const formData = new FormData();
                formData.append('file', profileImg);
                await api.post('/v1/uploads/profile-picture/me', formData);
            }

            // 2. Update remaining profile metadata
            await updateProfile(editForm);
            
            setEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('Failed to update profile: ' + (error.response?.data?.message || 'Server error'));
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (paymentSuccess) {
        return (
            <div className="theme-workspace-light" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '480px', background: '#fff', borderRadius: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#CFF971', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>✅</div>
                    <h2 style={{ color: '#0F2819', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>Your Booking Confirmed! 🎉</h2>
                    <p style={{ color: '#4B5563', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Your payment of <strong>LKR 2,000</strong> was received successfully.</p>
                    {paidAppt && (
                        <div style={{ margin: '1.5rem 0', padding: '1.2rem', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB', textAlign: 'left' }}>
                            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.3rem' }}>APPOINTMENT DETAILS</div>
                            <div style={{ fontWeight: 700, color: '#111827' }}>{paidAppt.doctorName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.2rem' }}>{paidAppt.doctorSpecialization}</div>
                            <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.4rem' }}>
                                📅 {new Date(paidAppt.appointmentDate).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                            </div>
                        </div>
                    )}
                    <button
                        style={{ background: '#CFF971', color: '#0F2819', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', width: '100%', marginBottom: '0.75rem' }}
                        onClick={() => { setPaymentSuccess(false); setActiveTab('appointments'); }}
                    >
                        View My Appointments
                    </button>
                    <button
                        style={{ background: 'none', color: '#6B7280', border: '1px solid #E5E7EB', padding: '0.6rem 2rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', width: '100%' }}
                        onClick={() => { setPaymentSuccess(false); setActiveTab('dashboard'); }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout theme-workspace-light">
            {/* Sidebar */}
            <aside className="sidebar">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="sidebar-logo">
                        <HeartIcon />
                        <span>CareLink</span>
                    </div>
                </Link>

                <nav className="sidebar-nav">
                    <div className="section-title">Patient Panel</div>
                    <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <UserIcon /> Profile Overview
                    </button>
                    <button className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                        <CalendarIcon /> Appointments
                    </button>
                    <button className={`sidebar-link ${activeTab === 'lab' ? 'active' : ''}`} onClick={() => setActiveTab('lab')}>
                        <FlaskIcon /> Lab Reports
                    </button>
                    <button className={`sidebar-link ${activeTab === 'symptom-log' ? 'active' : ''}`} onClick={() => setActiveTab('symptom-log')}>
                        <ActivityIcon /> Symptom History
                    </button>
                    <button className={`sidebar-link ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>
                        <PillIcon /> Digital Prescriptions
                    </button>
                    <button className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                        <ClipboardCheckIcon /> Medical History
                    </button>
                    <button className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <ChartBarIcon /> Reports & Analytics
                    </button>
                </nav>

                <div className="sidebar-nav" style={{ flex: 'none', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                        <LogOutIcon /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <style>{`
                    .pdf-mode {
                        background-color: #ffffff !important;
                        color: #111827 !important;
                        --bg-card: #ffffff !important;
                        --bg-input: #f9fafb !important;
                        --border: #e5e7eb !important;
                        --text-primary: #111827 !important;
                        --text-secondary: #4b5563 !important;
                    }
                    .pdf-mode .btn, .pdf-mode #dl-btn { display: none !important; }

                    .sos-pulse-btn {
                        animation: sos-pulse 1.8s infinite;
                        transition: transform 0.2s ease;
                    }
                    .sos-pulse-btn:hover {
                        transform: scale(1.08);
                    }
                    @keyframes sos-pulse {
                        0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
                        70% { box-shadow: 0 0 0 25px rgba(255, 71, 87, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
                    }
                    @keyframes fadeInScale {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-title">Welcome back, {user?.firstName || 'Patient'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <NotificationBell light />

                        <div 
                            onClick={() => setEditModalOpen(true)}
                            style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            background: 'rgba(207, 249, 113, 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: '#CFF971', fontWeight: 'bold',
                            overflow: 'hidden', border: '1.5px solid rgba(207, 249, 113, 0.3)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}>
                            {user?.profilePicturePath ? (
                                <img 
                                    src={`/api/v1/uploads/profile-picture/${user.profilePicturePath}`} 
                                    alt="Profile" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">

                    {/* ── Dashboard Tab ── */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="stat-cards">
                                <div className="stat-card">
                                    <div className="stat-card-label">Upcoming Appointments</div>
                                    <div className="stat-card-value">{appointments.filter(a => new Date(a.appointmentDate) >= new Date()).length || 0}</div>
                                    <div className="badge badge-patient mt-2" style={{ alignSelf: 'flex-start', cursor: 'pointer' }} onClick={() => setActiveTab('appointments')}>View Scheduled</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-label">Recent Prescriptions</div>
                                    <div className="stat-card-value">{prescriptions.length}</div>
                                    <div className="badge badge-active mt-2" style={{ alignSelf: 'flex-start', cursor: 'pointer' }} onClick={() => setActiveTab('prescriptions')}>Active</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-label">Symptoms Logged</div>
                                    <div className="stat-card-value">{symptomLogs.length}</div>
                                    <div className="badge badge-patient mt-2" style={{ alignSelf: 'flex-start', cursor: 'pointer' }} onClick={() => setActiveTab('symptom-log')}>View History</div>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="table-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1, gap: '1rem', paddingBottom: '0.5rem' }}>
                                        <QuickActionButton icon={<FlaskIcon />} label={<>View<br/>Lab Reports</>} onClick={() => setActiveTab('lab')} />
                                        <QuickActionButton icon={<ActivityIcon />} label={<>Symptom<br/>History</>} onClick={() => setActiveTab('symptom-log')} />
                                        <QuickActionButton icon={<FileTextIcon />} label={<>View<br/>Records</>} onClick={() => setActiveTab('history')} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Appointments Tab ── */}
                    {activeTab === 'appointments' && (
                        <div className="table-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ margin: 0 }}>📋 Appointments</h3>
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', margin: 0 }} onClick={() => { navigate('/'); setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>+ Book Appointment</button>
                            </div>
                            {appointments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗓️</div>
                                    <div>No appointments yet. <a href="/" style={{ color: 'var(--primary)' }}>Book one from the home page!</a></div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {appointments.filter(appt => {
                                        if (appt.status === 'EXPIRED') {
                                            const appointmentDate = new Date(appt.appointmentDate);
                                            const today = new Date();
                                            const diffTime = Math.abs(today - appointmentDate);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            if (diffDays > 7) return false;
                                        }
                                        return true;
                                    }).map(appt => {
                                        const statusMap = {
                                            PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: null },
                                            CONFIRMED: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: '✅ Confirmed' },
                                            CONFIRMED_PAID: { color: '#059669', bg: 'rgba(5,150,105,0.15)', label: '✅ Confirmed & Paid' },
                                            CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: '❌ Rejected' },
                                            EXPIRED: { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: '⏳ Expired' },
                                        };
                                        const s = statusMap[appt.status] || statusMap.PENDING;
                                        return (
                                            <div key={appt.id} style={{ padding: '1.1rem 1.2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-input)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1, minWidth: '200px' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{appt.doctorName}</div>
                                                    {appt.doctorSpecialization && (
                                                        <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.1rem' }}>{appt.doctorSpecialization}</div>
                                                    )}
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                                                        📅 {new Date(appt.appointmentDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </div>
                                                    {appt.reason && (
                                                        <div style={{ fontSize: '0.82rem', marginTop: '0.3rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                                            Reason: "{appt.reason}"
                                                        </div>
                                                    )}
                                                    {appt.bookingFor === 'DEPENDENT' && appt.dependentName && (
                                                        <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>👶 For: {appt.dependentName}</div>
                                                    )}
                                                    {appt.status === 'CANCELLED' && appt.rejectionReason && (
                                                        <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.08)', borderRadius: '6px', color: '#ef4444' }}>
                                                            ⚠️ Rejection note: {appt.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.8rem' }}>
                                                    {s.label && (
                                                        <span style={{ padding: '0.3rem 0.9rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                            {s.label}
                                                        </span>
                                                    )}
                                                    {/* Show Cancel button ONLY for upcoming PENDING/CONFIRMED appointments */}
                                                    {new Date(appt.appointmentDate) > new Date() && 
                                                     (appt.status === 'PENDING' || appt.status === 'CONFIRMED' || appt.status === 'CONFIRMED_PAID') && (
                                                        <button 
                                                            onClick={() => handleCancelAppointment(appt)}
                                                            className="btn"
                                                            style={{ 
                                                                padding: '0.3rem 1.1rem', 
                                                                fontSize: '0.78rem', 
                                                                width: 'auto', 
                                                                border: 'none', 
                                                                color: '#fff', 
                                                                background: '#ef4444', 
                                                                fontWeight: 700,
                                                                borderRadius: '8px',
                                                                margin: 0,
                                                                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {appt.status === 'COMPLETED' && !appt.reviewed && (
                                                        <button 
                                                            onClick={() => handleLeaveReview(appt)}
                                                            className="btn"
                                                            style={{ 
                                                                padding: '0.3rem 1.1rem', 
                                                                fontSize: '0.78rem', 
                                                                width: 'auto', 
                                                                border: 'none', 
                                                                color: '#0F2819', 
                                                                background: '#CFF971', 
                                                                fontWeight: 700,
                                                                borderRadius: '8px',
                                                                margin: 0,
                                                                boxShadow: '0 2px 4px rgba(207, 249, 113, 0.2)'
                                                            }}
                                                        >
                                                            ⭐ Leave Review
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Lab Tab ── */}
                    {activeTab === 'lab' && (
                        <div className="animate-in table-card" style={{ padding: '1.5rem' }}>
                            {/* Lab Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ margin: 0 }}>🔬 Lab Reports</h3>
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', margin: 0 }} onClick={() => { navigate('/'); setTimeout(() => document.getElementById('lab-tests')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>+ Book New Lab Test</button>
                            </div>

                            {/* Report Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                                {labReports.length === 0 ? (
                                    <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🧪</div>
                                        <h4 style={{ margin: '0 0 0.5rem' }}>No Diagnostic Records Yet</h4>
                                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Book your first lab test above to get started.</p>
                                    </div>
                                ) : labReports.map(report => {
                                    const STAT_COLORS = {
                                        REQUESTED: '#3b82f6', SAMPLE_COLLECTED: '#d97706', IN_LAB: '#8b5cf6',
                                        RESULT_READY: '#10b981', COMPLETED: '#059669', CANCELLED: '#ef4444'
                                    };
                                    const sc = STAT_COLORS[report.status] || '#888';
                                    return (
                                        <div key={report.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: sc }} />
                                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3b82f6', marginBottom: '0.3rem' }}>Diagnostic Test</div>
                                                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{report.labTest?.name}</h4>
                                                    </div>
                                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: sc + '20', color: sc, whiteSpace: 'nowrap' }}>
                                                        {report.status?.replace(/_/g, ' ')}
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                                                    {['REQUESTED', 'SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY', 'COMPLETED'].map(st => {
                                                        const stepOrder = ['REQUESTED', 'SAMPLE_COLLECTED', 'IN_LAB', 'RESULT_READY', 'COMPLETED'];
                                                        const currentStep = stepOrder.indexOf(report.status);
                                                        const thisStep = stepOrder.indexOf(st);
                                                        return <div key={st} style={{ flex: 1, height: '5px', borderRadius: '3px', background: currentStep >= thisStep ? STAT_COLORS[st] : 'var(--border)', transition: 'background 0.3s' }} />;
                                                    })}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                                    {report.bookingReference && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span>🔖</span>
                                                            <span style={{ fontFamily: 'monospace', background: 'var(--bg-input)', padding: '0.1rem 0.5rem', borderRadius: '5px', fontSize: '0.8rem' }}>{report.bookingReference}</span>
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                        <span>📅</span>
                                                        <span>{new Date(report.labSlot?.testTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                    </div>
                                                    {report.notes && (
                                                        <div style={{ padding: '0.6rem 0.75rem', background: 'var(--bg-input)', borderRadius: '8px', borderLeft: '3px solid var(--primary)', marginTop: '0.25rem' }}>
                                                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>FINDINGS</div>
                                                            {report.notes}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                                                    {report.reportFileUrl ? (
                                                        <a href={report.reportFileUrl} download={`Lab_Report_${report.bookingReference}.pdf`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, fontSize: '0.82rem', padding: '0.6rem', textAlign: 'center' }}>
                                                            📂 Download Report
                                                        </a>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                                            <button className="btn btn-outline" style={{ flex: 2, fontSize: '0.82rem', padding: '0.6rem', opacity: 0.6, cursor: 'not-allowed' }} disabled>
                                                                ⏳ Awaiting Results...
                                                            </button>
                                                            {(report.status === 'REQUESTED' || report.status === 'PAID') && (
                                                                <button 
                                                                    className="btn" 
                                                                    onClick={() => handleCancelLabBooking(report)}
                                                                    style={{ flex: 1, fontSize: '0.82rem', padding: '0.6rem', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── Multi-Step Booking Wizard Modal ── */}
                            {bookingStep > 0 && (
                                <div
                                    onClick={() => bookingStep !== 6 && setBookingStep(0)}
                                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}
                                >
                                    <div
                                        onClick={e => e.stopPropagation()}
                                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', width: '100%', maxWidth: '620px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                                    >
                                        {/* Wizard Header */}
                                        {bookingStep < 6 && (
                                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Step {bookingStep} of 5</div>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                                                        {bookingStep === 1 ? '🧪 Select a Test' :
                                                            bookingStep === 2 ? '📋 Preparation Instructions' :
                                                                bookingStep === 3 ? '🏥 Collection Method' :
                                                                    bookingStep === 4 ? '📅 Choose Date & Time' : '✅ Confirm Booking'}
                                                    </h3>
                                                </div>
                                                <div style={{ display: 'flex', gap: '3px' }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <div key={s} style={{ width: '28px', height: '4px', borderRadius: '2px', background: bookingStep >= s ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ overflowY: 'auto', flex: 1 }}>

                                            {/* Step 1: Select Test */}
                                            {bookingStep === 1 && (
                                                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {labTests.map(test => (
                                                        <div
                                                            key={test.id}
                                                            onClick={() => { setWizardTest(test); setBookingStep(2); }}
                                                            style={{ padding: '1.25rem', border: `2px solid ${wizardTest?.id === test.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '14px', cursor: 'pointer', background: wizardTest?.id === test.id ? 'var(--primary-10)' : 'var(--bg-input)', transition: 'all 0.2s' }}
                                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                            onMouseLeave={e => { if (wizardTest?.id !== test.id) e.currentTarget.style.borderColor = 'var(--border)'; }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                                                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{test.name}</span>
                                                                        {test.fastingRequired && <span style={{ fontSize: '0.68rem', background: 'rgba(251,191,36,0.15)', color: '#d97706', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>⚠️ FASTING</span>}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{test.description}</div>
                                                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                                        <span>⏱ ~{test.durationMinutes} min</span>
                                                                        {test.resourceRequired && <span>🔧 {test.resourceRequired}</span>}
                                                                    </div>
                                                                </div>
                                                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)', marginLeft: '1rem', whiteSpace: 'nowrap' }}>LKR {test.price?.toLocaleString()}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Step 2: Prep Instructions */}
                                            {bookingStep === 2 && wizardTest && (
                                                <div style={{ padding: '2rem' }}>
                                                    <div style={{ background: wizardTest.fastingRequired ? 'rgba(251,191,36,0.08)' : 'rgba(52,211,153,0.06)', border: `1px solid ${wizardTest.fastingRequired ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.25)'}`, borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
                                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{wizardTest.fastingRequired ? '⚠️' : '✅'}</div>
                                                        <h4 style={{ margin: '0 0 0.75rem', textAlign: 'center', color: wizardTest.fastingRequired ? '#d97706' : '#10b981' }}>
                                                            {wizardTest.fastingRequired ? 'Fasting Required' : 'No Special Fasting Required'}
                                                        </h4>
                                                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                            {wizardTest.prepInstructions || 'No specific preparation is needed for this test.'}
                                                        </p>
                                                        {wizardTest.fastingRequired && (
                                                            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#d97706', fontWeight: 600 }}>I understand and agree to follow these instructions before my test.</div>
                                                        )}
                                                    </div>
                                                    <div style={{ background: 'var(--bg-input)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                                        <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>📋 Test Details</div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                            <div>Duration: ~{wizardTest.durationMinutes} minutes</div>
                                                            <div>Price: LKR {wizardTest.price?.toLocaleString()}</div>
                                                            {wizardTest.resourceRequired && <div>Resource: {wizardTest.resourceRequired}</div>}
                                                            <div>Category: {wizardTest.category}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                        <button onClick={() => setBookingStep(1)} className="btn btn-outline" style={{ flex: 1 }}>← Back</button>
                                                        <button onClick={() => setBookingStep(4)} className="btn btn-primary" style={{ flex: 2 }}>I Understand, Continue →</button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 4: Choose Slot */}
                                            {bookingStep === 4 && (
                                                <div style={{ padding: '2rem' }}>
                                                    {availableDates.length === 0 ? (
                                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No available slots at this time. Please check back later.</div>
                                                    ) : (
                                                        <>
                                                            <div style={{ marginBottom: '1.25rem' }}>
                                                                <label className="form-label" style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'block' }}>📅 Choose Appointment Date</label>
                                                                <input 
                                                                    type="date" 
                                                                    className="form-input"
                                                                    min={new Date().toISOString().split('T')[0]}
                                                                    value={selectedDate || ''}
                                                                    onChange={e => { setSelectedDate(e.target.value); setWizardSlot(null); }}
                                                                    style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '0.85rem 1rem' }}
                                                                />
                                                            </div>

                                                            {selectedDate && (
                                                                <div style={{ marginBottom: '1.5rem' }}>
                                                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Available times:</div>
                                                                    {(slotsByDate[selectedDate] || []).length > 0 ? (
                                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                                                                            {slotsByDate[selectedDate].map(slot => (
                                                                                <button
                                                                                    key={slot.id}
                                                                                    onClick={() => setWizardSlot(slot)}
                                                                                    style={{ padding: '0.75rem', borderRadius: '10px', border: `2px solid ${wizardSlot?.id === slot.id ? 'var(--primary)' : 'var(--border)'}`, background: wizardSlot?.id === slot.id ? 'var(--primary-10)' : 'var(--bg-input)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                                                                                >
                                                                                    <div style={{ fontWeight: 700, color: wizardSlot?.id === slot.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                                                                                        {new Date(slot.testTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                                                    </div>
                                                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                                                        {slot.remainingCapacity ?? (slot.capacity - slot.bookedCount)} spot{slot.remainingCapacity !== 1 ? 's' : ''} left
                                                                                    </div>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-input)', borderRadius: '14px', border: '1px dashed var(--border)', color: 'var(--text-secondary)' }}>
                                                                            No available slots for this date.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                                                <button onClick={() => setBookingStep(2)} className="btn btn-outline" style={{ flex: 1 }}>← Back</button>
                                                                <button onClick={() => setBookingStep(5)} className="btn btn-primary" style={{ flex: 2 }} disabled={!wizardSlot}>Next →</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Step 5: Confirm */}
                                            {bookingStep === 5 && wizardTest && wizardSlot && (
                                                <div style={{ padding: '2rem' }}>
                                                    <div style={{ background: 'var(--bg-input)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Booking Summary</div>
                                                        {[
                                                            { label: 'Test', value: wizardTest.name },
                                                            { label: 'Category', value: wizardTest.category },
                                                            { label: 'Date', value: new Date(wizardSlot.testTime).toLocaleDateString('en-US', { dateStyle: 'full' }) },
                                                            { label: 'Time', value: new Date(wizardSlot.testTime).toLocaleTimeString('en-US', { timeStyle: 'short' }) },
                                                            { label: 'Price', value: 'LKR ' + wizardTest.price?.toLocaleString() },
                                                        ].map(row => (
                                                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                                                <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                                                                <span style={{ fontWeight: 600 }}>{row.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {wizardTest.prepInstructions && (
                                                        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', padding: '0.9rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#d97706' }}>
                                                            ⚠️ {wizardTest.prepInstructions}
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                        <button onClick={() => setBookingStep(4)} className="btn btn-outline" style={{ flex: 1 }}>← Back</button>
                                                        <button onClick={handleConfirmBooking} className="btn btn-primary" style={{ flex: 2 }} disabled={bookingLoading}>
                                                            {bookingLoading ? 'Booking...' : '✅ Confirm Booking'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 6: Success */}
                                            {bookingStep === 6 && wizardResult && (
                                                <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,198,167,0.15)', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>✅</div>
                                                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem' }}>Booking Confirmed!</h3>
                                                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 2rem' }}>You will receive a notification confirmation. Please check your notifications.</p>
                                                    <div style={{ background: 'var(--bg-input)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Booking Reference</div>
                                                        <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>{wizardResult.bookingReference}</div>
                                                    </div>
                                                    <button onClick={() => setBookingStep(0)} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                                                        Close & View My Tests
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Symptom Log Tab ── */}
                    {activeTab === 'symptom-log' && (
                        <div className="animate-in table-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>📊 AI Symptom Checker History</h3>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ margin: 0, padding: '0.5rem 1.2rem', fontSize: '0.85rem', width: 'auto', borderRadius: '100px', fontWeight: 800 }} 
                                    onClick={() => {
                                        navigate('/');
                                        setTimeout(() => {
                                            const el = document.getElementById('disease-predictor');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }, 500);
                                    }}
                                >
                                    + New Symptom Check
                                </button>
                            </div>
                            
                            {symptomLogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📈</div>
                                    <h4 style={{ margin: '0' }}>No History Found</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>Check your symptoms on our landing page and save the results!</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '2.5px solid #e2e8f0' }}>
                                                <th style={{ padding: '1.2rem 1rem', color: '#64748b', fontWeight: 600 }}>Date</th>
                                                <th style={{ padding: '1.2rem 1rem', color: '#64748b', fontWeight: 600 }}>Selected Symptoms</th>
                                                <th style={{ padding: '1.2rem 1rem', color: '#64748b', fontWeight: 600 }}>AI Predicted Condition</th>
                                                <th style={{ padding: '1.2rem 1rem', color: '#64748b', fontWeight: 600 }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {symptomLogs.map((log) => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '1.1rem 1rem', color: '#334155' }}>
                                                        <div style={{ fontWeight: 600 }}>{new Date(log.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </td>
                                                    <td style={{ padding: '1.1rem 1rem' }}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                            {log.symptoms.map((s, i) => (
                                                                <span key={i} style={{ padding: '3px 8px', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.1rem 1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{log.predictedDisease}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.1rem 1rem' }}>
                                                        <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800 }}>DASHBOARD VISIBLE</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Prescriptions Tab ── */}
                    {activeTab === 'prescriptions' && (
                        <div className="animate-in table-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>📋 Digital Prescriptions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {prescriptions.length === 0 ? (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>💊</div>
                                        <h4 style={{ margin: '0' }}>No Prescriptions Found</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>Your digital prescriptions from CareLink doctors will appear here.</p>
                                    </div>
                                ) : (
                                    prescriptions.map(p => (
                                        <div id={`prescription-${p.id}`} key={p.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>Reference #{p.id}</div>
                                                    <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>Dr. {p.doctor.firstName} {p.doctor.lastName}</h4>
                                                </div>
                                                <button 
                                                   className="btn" 
                                                   id={`dl-btn-${p.id}`}
                                                   style={{ background: '#CFF971', color: '#0F2819', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.72rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
                                                   title="Download as PDF"
                                                   onClick={() => {
                                                       const element = document.getElementById(`prescription-${p.id}`);
                                                       element.classList.add('pdf-mode');
                                                       const btn = document.getElementById(`dl-btn-${p.id}`);
                                                       if (btn) btn.style.display = 'none';
                                                       const opt = {
                                                           margin: 0.5,
                                                           filename: `Prescription_${p.id}.pdf`,
                                                           image: { type: 'jpeg', quality: 0.98 },
                                                           html2canvas: { scale: 2 },
                                                           jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                                                       };
                                                       html2pdf().set(opt).from(element).save().then(() => {
                                                           element.classList.remove('pdf-mode');
                                                           if (btn) btn.style.display = 'block';
                                                       });
                                                   }}
                                                >
                                                   ⬇️ Save PDF
                                                </button>
                                            </div>

                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                                📅 Issued on {new Date(p.issuedDate).toLocaleDateString()}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {p.items.map(item => (
                                                    <div key={item.id} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.medicine.name}</div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <span>✨ {item.dosage}</span>
                                                            <span>• {item.frequency}</span>
                                                            <span>• {item.duration}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: '#3b82f6', fontWeight: 600 }}>Total: {item.totalQuantity} units</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {p.clinicalNotes && (
                                                <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                                    " {p.clinicalNotes} "
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── History Tab ── */}
                    {activeTab === 'history' && (
                        <div className="medical-history-container animate-in table-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                            <h3 style={{ margin: '0 0 1.2rem 0' }}>📄 Electronic Medical Record (EMR)</h3>
                            <div className="table-responsive">
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <thead style={{ background: '#3b82f6' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600, borderTopLeftRadius: '8px' }}>Date</th>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600 }}>Type</th>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600 }}>Description / Test</th>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600 }}>Provider</th>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600 }}>Status</th>
                                            <th style={{ padding: '1rem', borderBottom: '2px solid #2563eb', color: '#ffffff', fontWeight: 600, borderTopRightRadius: '8px' }}>Record</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...appointments, ...labReports.map(r => ({ ...r, isLab: true }))]
                                            .sort((a, b) => new Date(b.appointmentDate || b.labSlot?.testTime) - new Date(a.appointmentDate || a.labSlot?.testTime))
                                            .map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(item.appointmentDate || item.labSlot?.testTime).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {item.isLab ? (
                                                            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>Lab</span>
                                                        ) : (
                                                            <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#b45309' }}>Consult</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{item.isLab ? item.labTest?.name : item.reason || 'General Checkup'}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{item.doctorName || 'Lab Technician'}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{item.status?.replace(/_/g, ' ')}</span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {item.isLab && item.reportFileUrl ? (
                                                            <a href={item.reportFileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>View Result</a>
                                                        ) : !item.isLab ? (
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clinic Visit</span>
                                                        ) : (
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>N/A</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        {appointments.length === 0 && labReports.length === 0 && (
                                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No medical records found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── ANALYTICS TAB ─────────────────────────────────────── */}
                    {activeTab === 'analytics' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                                <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '12px', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChartBarIcon /></div>
                                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>Health & Activity Insights</h3>
                            </div>
                            <AnalyticsView appointments={appointments} labReports={labReports} />
                        </div>
                    )}

                </div>
            </main>

            {/* ── Profile Update Modal ── */}
            {editModalOpen && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '100%', padding: 0, background: '#ffffff', color: '#111827', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                        {/* Modal Hero Header */}
                        <div style={{ background: '#CFF971', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.8rem 2rem 1.4rem', position: 'relative', flexShrink: 0 }}>
                            <button type="button" className="btn btn-ghost" onClick={() => setEditModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#111827', fontSize: '1.1rem', padding: '4px 8px' }}>✕</button>
                            
                            <ProfilePictureUpload 
                                image={profileImg} 
                                currentImage={user?.profilePicturePath}
                                onChange={setProfileImg} 
                            />

                            <h2 style={{ color: '#111827', margin: 0, fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}>Update Patient Profile</h2>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', margin: '0.25rem 0 0', fontWeight: 500, textAlign: 'center' }}>{user?.email}</p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveProfile} style={{ padding: '1.6rem 2rem 2rem', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span>📞</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Contact Information</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+94 77 123 4567" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea className="form-input" rows="2" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ background: 'rgba(207, 249, 113, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(207, 249, 113, 0.2)', marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0F2819', fontSize: '0.9rem' }}>Two-Step Verification</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Add an extra layer of security to your account.</div>
                                        </div>
                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={editForm.twoFactorEnabled} 
                                                onChange={e => setEditForm({...editForm, twoFactorEnabled: e.target.checked})}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{ 
                                                position: 'absolute', cursor: 'pointer', inset: 0, background: editForm.twoFactorEnabled ? '#CFF971' : '#ccc', 
                                                transition: '.4s', borderRadius: '24px' 
                                            }}>
                                                <span style={{ 
                                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: editForm.twoFactorEnabled ? '23px' : '3px', bottom: '3px', 
                                                    background: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }} />
                                            </span>
                                        </label>
                                    </div>
                                </div>

                            <div style={{ borderTop: '1px solid #E5E7EB', margin: '1.2rem 0' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span>🩺</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Medical Details</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Known Allergies</label>
                                <input className="form-input" placeholder="e.g. Peanuts, Penicillin (leave blank if none)" value={editForm.allergies} onChange={e => setEditForm({ ...editForm, allergies: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>

                            <div style={{ borderTop: '1px solid #E5E7EB', margin: '1.2rem 0' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span>🆘</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Emergency Contact</span>
                            </div>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Contact Name</label>
                                    <input className="form-input" placeholder="Saman Perera" value={editForm.emergencyContactName} onChange={e => setEditForm({ ...editForm, emergencyContactName: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Contact Phone</label>
                                    <input type="tel" className="form-input" placeholder="+94 71 987 6543" value={editForm.emergencyContactPhone} onChange={e => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditModalOpen(false)} style={{ flex: 1, border: '1px solid #D1D5DB', color: '#4B5563', background: '#FFFFFF', height: '52px', margin: 0 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#CFF971', color: '#111827', border: 'none', height: '52px', margin: 0 }}>
                                    {saving ? (<><div className="spinner" /> Saving...</>) : '💾 Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Doctor Review Modal ── */}
            {reviewModalOpen && (
                <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', background: '#fff', borderRadius: '24px', padding: '2rem', color: '#111827' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem' }}>Rate Your Doctor</h3>
                        <p style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Your feedback helps others make informed decisions.</p>
                        <form onSubmit={submitDoctorReview}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 600 }}>Rating</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            type="button" 
                                            key={star} 
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            style={{ 
                                                fontSize: '1.8rem', 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                color: star <= reviewData.rating ? '#F59E0B' : '#E5E7EB',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 600 }}>Review Comment</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    required
                                    placeholder="Tell us about your experience..."
                                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }}
                                    value={reviewData.comment} 
                                    onChange={e => setReviewData({ ...reviewData, comment: e.target.value })} 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', alignItems: 'center' }}>
                                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn" style={{ flex: 1, background: '#F3F4F6', color: '#4B5563', border: 'none', height: '52px', margin: 0 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, margin: 0, height: '52px' }}>Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating SOS Button - Only visible in Dashboard */}
            {activeTab === 'dashboard' && <SOSButton />}
        </div>
    );
}

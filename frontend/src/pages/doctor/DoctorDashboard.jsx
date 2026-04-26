import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend,
    LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar
} from 'recharts';

const SPECIALIZATIONS = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic Specialist', 'Pediatrician', 'Gastroenterologist', 'Endocrinologist',
    'Pulmonologist', 'Rheumatologist', 'ENT Specialist', 'Urologist',
    'Infectious Disease Specialist', 'Hepatologist', 'Allergist / Immunologist',
    'Psychiatrist', 'Gynecologist', 'Oncologist', 'Radiologist',
    'Anesthesiologist', 'Nephrologist', 'Ophthalmologist',
    'Proctologist / General Surgeon', 'Vascular Surgeon', 'Other'
];

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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
}
function CalendarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}
function BriefcaseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
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
function LogOutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
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

const STATUS_STYLE = {
    PENDING: { color: '#b45309', bg: 'rgba(217, 119, 6, 0.15)', label: '🕒 Pending' },
    CONFIRMED: { color: '#047857', bg: 'rgba(5, 150, 105, 0.15)', label: '✅ Scheduled' },
    CANCELLED: { color: '#b91c1c', bg: 'rgba(220, 38, 38, 0.15)', label: '❌ Rejected' },
    EXPIRED: { color: '#4b5563', bg: 'rgba(75, 85, 99, 0.15)', label: '⏳ Expired' },
};

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
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a2e0e', transition: 'all 0.3s cubic-bezier(0.2,0.8,0.2,1)', background: '#CFF971', boxShadow: '0 3px 8px rgba(207, 249, 113, 0.2)' }}>
            <div style={{ transform: 'scale(1.3)' }}>{icon}</div>
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'center', color: '#4b5563', textTransform: 'uppercase', lineHeight: 1.3, letterSpacing: '0.02em', maxWidth: '100px' }}>
            {label}
        </div>
    </div>
);

function AnalyticsView({ appointments, schedules }) {
    const getAppointmentsTrend = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i));
            const yyyy = d.getFullYear(); const mm = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        });
        const dataMap = {};
        last7Days.forEach(day => dataMap[day] = 0);
        appointments.forEach(a => {
            if (a.appointmentDate) {
                const day = a.appointmentDate.substring(0, 10);
                if (dataMap[day] !== undefined) dataMap[day]++;
            }
        });
        return last7Days.map(date => {
            const dateObj = new Date(date);
            return { name: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), count: dataMap[date] };
        });
    };

    const getStatusData = () => {
        const statusMap = { 'CONFIRMED': 0, 'PENDING': 0, 'CANCELLED': 0 };
        appointments.forEach(a => {
            if (statusMap[a.status] !== undefined) statusMap[a.status]++;
        });
        return [
            { name: 'Confirmed', value: statusMap['CONFIRMED'] },
            { name: 'Pending', value: statusMap['PENDING'] },
            { name: 'Cancelled', value: statusMap['CANCELLED'] },
        ];
    };

    const getShiftData = () => {
        return [
            { name: 'Morning (AM)', value: appointments.filter(a => parseInt(a.appointmentDate.substring(11, 13)) < 12).length },
            { name: 'Afternoon/Eve', value: appointments.filter(a => parseInt(a.appointmentDate.substring(11, 13)) >= 12).length }
        ];
    };

    const trendData = getAppointmentsTrend();
    const statusData = getStatusData();
    const shiftData = getShiftData();
    const COLORS = ['#10b981', '#fbbf24', '#f87171'];
    const PIE_COLORS = ['#3b82f6', '#8b5cf6'];

    return (
        <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Visits (Last 7 Days)</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Appointment Status</h3>
                <div style={{ flex: 1, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {statusData.map((e, index) => <Cell key={index} fill={COLORS[index]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontSize: '1.1rem' }}>Shift Distribution</h3>
                <div style={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={shiftData} cx="50%" cy="45%" innerRadius="55%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                                {shiftData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />)}
                            </Pie>
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                            <RechartsLegend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default function DoctorDashboard() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [patientReviews, setPatientReviews] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [saving, setSaving] = useState(false);
    const [profileImg, setProfileImg] = useState(null);
    const [schedSaving, setSchedSaving] = useState(false);
    const [actionMsg, setActionMsg] = useState('');

    const [schedForm, setSchedForm] = useState({
        scheduleDate: '', shiftStart: '', shiftEnd: '',
        consultationDuration: '30', consultationFee: '',
        breakStart: '', breakEnd: ''
    });
    const [editingSchedule, setEditingSchedule] = useState(null);

    const [editForm, setEditForm] = useState({
        phone: '', specialization: '', qualifications: '', yearsOfExperience: '',
        twoFactorEnabled: false
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    // Prescription State
    const [prescModalOpen, setPrescModalOpen] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [patientResults, setPatientResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [newPresc, setNewPresc] = useState({ clinicalNotes: '', items: [] });
    const [issuing, setIssuing] = useState(false);

    useEffect(() => {
        if (user) {
            setEditForm({
                phone: user.phone || '',
                specialization: user.specialization || '',
                qualifications: user.qualifications || '',
                yearsOfExperience: user.yearsOfExperience || '',
                twoFactorEnabled: user.twoFactorEnabled || false
            });
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'dashboard' || activeTab === 'appointments' || activeTab === 'allappointments' || activeTab === 'analytics') {
            fetchAppointments();
            fetchSchedules();

            // Auto-refresh stats every 30s
            const interval = setInterval(() => {
                fetchAppointments();
                fetchSchedules();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    useEffect(() => {
        if (prescModalOpen) {
            fetchMedicines();
        }
    }, [prescModalOpen]);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/v1/medicines');
            setMedicines(res.data);
        } catch (err) { console.error(err); }
    };

    const handlePatientSearch = async (val) => {
        setPatientSearch(val);
        if (val.length < 2) { setPatientResults([]); return; }
        try {
            const res = await api.get(`/v1/users/patients/search?query=${val}`);
            setPatientResults(res.data);
        } catch (err) { console.error(err); }
    };

    const addPrescItem = () => {
        setNewPresc({ ...newPresc, items: [...newPresc.items, { medicineId: '', dosage: '', frequency: '', duration: '', totalQuantity: 1 }] });
    };

    const handleIssuePresc = async (e) => {
        e.preventDefault();
        if (!selectedPatient) { alert('Please select a patient first'); return; }
        if (newPresc.items.length === 0) { alert('Add at least one medicine'); return; }
        setIssuing(true);
        try {
            await api.post('/v1/prescriptions', { ...newPresc, patientId: selectedPatient.id });
            alert('\u2705 Prescription issued successfully!');
            setPrescModalOpen(false);
            setNewPresc({ clinicalNotes: '', items: [] });
            setSelectedPatient(null);
        } catch (err) { alert(err.response?.data?.message || 'Failed to issue prescription'); }
        finally { setIssuing(false); }
    };

    const fetchAppointments = async () => {
        try { const r = await api.get('/v1/appointments/me'); setAppointments(r.data); }
        catch (e) { console.error(e); }
    };

    const fetchReviews = async () => {
        try { const r = await api.get('/v1/doctor-reviews/me'); setPatientReviews(r.data); }
        catch (e) { console.error(e); }
    };

    const fetchSchedules = async () => {
        try { const r = await api.get('/v1/schedules/me'); setSchedules(r.data); }
        catch (e) { console.error(e); }
    };

    const handleSaveSchedule = async (e) => {
        e.preventDefault();
        setSchedSaving(true);
        setActionMsg('');
        try {
            if (editingSchedule) {
                await api.put(`/v1/schedules/${editingSchedule.id}`, schedForm);
                setActionMsg('✅ Schedule updated successfully!');
            } else {
                await api.post('/v1/schedules', schedForm);
                setActionMsg('✅ Schedule saved successfully!');
            }
            setSchedForm({ 
                scheduleDate: '', shiftStart: '', shiftEnd: '', 
                consultationDuration: '30', consultationFee: '', 
                breakStart: '', breakEnd: '' 
            });
            setEditingSchedule(null);
            fetchSchedules();
        } catch (err) { 
            setActionMsg(`❌ Failed to save schedule: ${err.response?.data || 'Unknown error'}`); 
        }
        finally { setSchedSaving(false); }
    };

    const handleEditScheduleBatch = (s) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingSchedule(s);
        setSchedForm({
            scheduleDate: s.scheduleDate,
            shiftStart: s.shiftStart,
            shiftEnd: s.shiftEnd,
            consultationDuration: s.consultationDuration.toString(),
            consultationFee: s.consultationFee || '',
            breakStart: s.breakStart || '',
            breakEnd: s.breakEnd || ''
        });
    };

    const handleDeleteSchedule = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shift? This will fail if patients are already booked.')) return;
        try {
            await api.delete(`/v1/schedules/${id}`);
            alert('✅ Schedule deleted.');
            if (editingSchedule && editingSchedule.id === id) {
                setEditingSchedule(null);
                setSchedForm({ scheduleDate: '', shiftStart: '', shiftEnd: '', consultationDuration: '30', consultationFee: '', breakStart: '', breakEnd: '' });
            }
            fetchSchedules();
        } catch (err) {
            alert(`❌ Cannot delete: ${err.response?.data || 'Active appointments might exist.'}`);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/v1/appointments/${id}/approve`);
            fetchAppointments();
        } catch { alert('Failed to approve'); }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Rejection reason (optional):') || '';
        try {
            await api.patch(`/v1/appointments/${id}/reject`, { reason });
            fetchAppointments();
        } catch { alert('Failed to reject'); }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault(); 
        setSaving(true);
        try { 
            if (profileImg) {
                const formData = new FormData();
                formData.append('file', profileImg);
                await api.post('/v1/uploads/profile-picture/me', formData);
            }
            await updateProfile(editForm); 
            setEditModalOpen(false); 
            window.location.reload(); 
        }
        catch (err) { 
            console.error('Profile Update Error:', err);
            alert('Failed to update profile: ' + (err.response?.data?.message || 'Server error')); 
        }
        finally { setSaving(false); }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const openDetails = (appt) => {
        setSelectedAppointment(appt);
        setDetailsModalOpen(true);
    };

    // Pending appointments are handled via patient payment — no doctor approval queue needed
    const pendingAppts = []; // Payment auto-confirms
    const otherAppts = appointments;

    return (
        <div className="dashboard-layout theme-workspace-light">
            {/* Sidebar */}
            <aside className="sidebar">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="sidebar-logo"><HeartIcon /><span>CareLink</span></div>
                </Link>
                <nav className="sidebar-nav">
                    <div className="section-title">Clinical Hub</div>
                    <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <UserIcon /> My Dashboard
                    </button>
                    <button className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                        <CalendarIcon /> Schedule & Bookings
                        {pendingAppts.length > 0 && (
                            <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: '9999px', fontSize: '0.7rem', padding: '1px 7px', fontWeight: 700 }}>
                                {pendingAppts.length}
                            </span>
                        )}
                    </button>
                    <button className={`sidebar-link ${activeTab === 'allappointments' ? 'active' : ''}`} onClick={() => { setActiveTab('allappointments'); fetchAppointments(); }}>
                        <ActivityIcon /> All Appointments
                    </button>
                    <button className={`sidebar-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => { setActiveTab('reviews'); fetchReviews(); }}>
                        <HeartIcon /> Patient Reviews
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
                <header className="topbar">
                    <div className="topbar-title">Welcome back, Dr. {user?.lastName || 'Doctor'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <NotificationBell light />
                        <div 
                            onClick={() => setEditModalOpen(true)}
                            style={{ 
                             width: '40px', height: '40px', borderRadius: '50%', 
                            background: 'rgba(207, 249, 113, 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: '#0F2819', fontSize: '1.2rem', fontWeight: 800,
                            overflow: 'hidden', border: '1.5px solid rgba(15, 40, 25, 0.2)',
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
                                user?.lastName ? user.lastName.charAt(0).toUpperCase() : 'D'
                            )}
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    {/* ── DASHBOARD TAB ─────────────────────────────────────── */}
                    {activeTab === 'dashboard' && (
                        <>
                             <div className="stat-cards">
                                 <div className="stat-card" style={{ background: '#CFF971', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(207,249,113,0.1)' }}>
                                     <div className="stat-card-label" style={{ fontWeight: 700, color: '#0F2819', opacity: 0.7 }}>Monthly Revenue</div>
                                     <div className="stat-card-value" style={{ color: '#0F2819', fontSize: '2rem', fontWeight: 800 }}>
                                         LKR {(appointments
                                             .filter(a => (a.status === 'CONFIRMED' || a.status === 'COMPLETED' || a.status === 'CONFIRMED_PAID'))
                                             .filter(a => {
                                                 const d = new Date(a.appointmentDate);
                                                 const now = new Date();
                                                 return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                             })
                                             .reduce((sum, a) => sum + 2500, 0)
                                         ).toLocaleString()}
                                     </div>
                                     <div className="badge mt-2" style={{ alignSelf: 'flex-start', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 700 }}>This Month</div>
                                 </div>
                                 <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                     <div className="stat-card-label" style={{ fontWeight: 700, color: '#6B7280' }}>Confirmed Today</div>
                                     <div className="stat-card-value" style={{ color: '#111827', fontSize: '2rem', fontWeight: 800 }}>
                                         {appointments.filter(a => a.status === 'CONFIRMED' && new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length}
                                     </div>
                                     <div className="badge badge-active mt-2" style={{ alignSelf: 'flex-start', borderRadius: '10px' }}>Today</div>
                                 </div>
                                 <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                     <div className="stat-card-label" style={{ fontWeight: 700, color: '#6B7280' }}>Total Schedules</div>
                                     <div className="stat-card-value" style={{ color: '#111827', fontSize: '2rem', fontWeight: 800 }}>{schedules.length}</div>
                                     <div className="badge mt-2" style={{ alignSelf: 'flex-start', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>Shifts set</div>
                                 </div>
                             </div>

                            <div className="form-grid">
                                {/* Quick Actions */}
                                <div className="table-card" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                    <h3 style={{ marginBottom: '2rem', textAlign: 'center', color: '#111827', fontSize: '1.1rem', fontWeight: 800 }}>Clinical Shortcuts</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1, gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                                        <QuickActionButton icon={<CalendarIcon />} label={<>Active<br/>Schedules</>} onClick={() => setActiveTab('appointments')} />
                                        <QuickActionButton icon={<BriefcaseIcon />} label={<>All<br/>Appointments</>} onClick={() => { setActiveTab('allappointments'); fetchAppointments(); }} />
                                        <QuickActionButton icon={<ActivityIcon />} label={<>New<br/>Prescription</>} onClick={() => setPrescModalOpen(true)} />
                                    </div>
                                </div>
                            </div>


                        </>
                    )}

                    {/* ── APPOINTMENTS TAB ──────────────────────────────────── */}
                    {activeTab === 'appointments' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Set Schedule Form */}
                            <div className="table-card" style={{ padding: '1.8rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '12px', background: editingSchedule ? 'rgba(59,130,246,0.1)' : '#F3F4F6', borderRadius: '12px', color: editingSchedule ? '#3b82f6' : '#111827' }}><ClockIcon /></div>
                                    <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>{editingSchedule ? 'Edit Clinical Availability' : 'Publish Clinical Availability'}</h3>
                                </div>
                                {actionMsg && (
                                    <div style={{ padding: '1rem', borderRadius: '14px', background: actionMsg.includes('✅') ? '#ECFDF5' : '#FEF2F2', color: actionMsg.includes('✅') ? '#059669' : '#DC2626', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 600, border: `1px solid ${actionMsg.includes('✅') ? '#A7F3D0' : '#FECACA'}` }}>
                                        {actionMsg}
                                    </div>
                                )}
                                <form onSubmit={handleSaveSchedule}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>📅</span> Appointment Date
                                            </label>
                                            <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]}
                                                value={schedForm.scheduleDate} onChange={e => setSchedForm({ ...schedForm, scheduleDate: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>🕘</span> Session Start
                                            </label>
                                            <input type="time" className="form-input" required value={schedForm.shiftStart}
                                                onChange={e => setSchedForm({ ...schedForm, shiftStart: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>🕔</span> Session End
                                            </label>
                                            <input type="time" className="form-input" required value={schedForm.shiftEnd}
                                                onChange={e => setSchedForm({ ...schedForm, shiftEnd: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '0' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>⏱</span> Consultation Slot
                                            </label>
                                            <select className="form-input" value={schedForm.consultationDuration}
                                                onChange={e => setSchedForm({ ...schedForm, consultationDuration: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }}>
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="45">45 minutes</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>💰</span> Consultation Fee (LKR)
                                            </label>
                                            <input type="number" className="form-input" placeholder="e.g. 2500" min="0"
                                                value={schedForm.consultationFee} onChange={e => setSchedForm({ ...schedForm, consultationFee: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }} />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                <label className="form-label" style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                                                    <span>☕</span> Break Start <span style={{ fontWeight: 400, fontSize: '0.75rem', color: '#9CA3AF' }}>(Optional)</span>
                                                </label>
                                                {(schedForm.breakStart || schedForm.breakEnd) && (
                                                    <button type="button" onClick={() => setSchedForm({ ...schedForm, breakStart: '', breakEnd: '' })} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: 700 }}>Clear Break</button>
                                                )}
                                            </div>
                                            <input type="time" className="form-input" value={schedForm.breakStart}
                                                onChange={e => setSchedForm({ ...schedForm, breakStart: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'end' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span>☕</span> Break End
                                            </label>
                                            <input type="time" className="form-input" value={schedForm.breakEnd}
                                                onChange={e => setSchedForm({ ...schedForm, breakEnd: e.target.value })} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', height: '48px', margin: 0 }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            {editingSchedule && (
                                                <button type="button" onClick={() => {
                                                    setEditingSchedule(null);
                                                    setSchedForm({ scheduleDate: '', shiftStart: '', shiftEnd: '', consultationDuration: '30', consultationFee: '', breakStart: '', breakEnd: '' });
                                                }} style={{
                                                    flex: 1, borderRadius: '16px',
                                                    background: '#F3F4F6',
                                                    color: '#4B5563', height: '48px', fontWeight: 700,
                                                    fontSize: '1rem', border: 'none', cursor: 'pointer',
                                                    margin: 0
                                                }}>
                                                    Cancel
                                                </button>
                                            )}
                                            <button type="submit" disabled={schedSaving} style={{
                                                flex: 2, borderRadius: '16px',
                                                background: editingSchedule ? '#3b82f6' : '#CFF971',
                                                color: editingSchedule ? '#FFFFFF' : '#0F2819', height: '48px', fontWeight: 800,
                                                fontSize: '1rem', border: 'none', cursor: 'pointer',
                                                boxShadow: editingSchedule ? '0 4px 16px rgba(59, 130, 246, 0.4)' : '0 4px 16px rgba(207, 249, 113, 0.4)',
                                                letterSpacing: '0.03em', transition: 'all 0.2s ease',
                                                margin: 0
                                            }}
                                                onMouseEnter={e => { 
                                                    e.currentTarget.style.background = editingSchedule ? '#2563eb' : '#bfef6a'; 
                                                    e.currentTarget.style.boxShadow = editingSchedule ? '0 6px 20px rgba(59, 130, 246, 0.6)' : '0 6px 20px rgba(207,249,113,0.6)'; 
                                                }}
                                                onMouseLeave={e => { 
                                                    e.currentTarget.style.background = editingSchedule ? '#3b82f6' : '#CFF971'; 
                                                    e.currentTarget.style.boxShadow = editingSchedule ? '0 4px 16px rgba(59, 130, 246, 0.4)' : '0 4px 16px rgba(207, 249, 113, 0.4)'; 
                                                }}
                                            >
                                                {schedSaving ? 'Saving...' : (editingSchedule ? 'Update Clinical Shift' : 'Publish Availability')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Pending Appointment Requests */}
                            {pendingAppts.length > 0 && (
                                <div className="table-card" style={{ padding: '1.8rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.4rem' }}>🔔</span> Pending Booking Requests ({pendingAppts.length})
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {pendingAppts.map(appt => (
                                            <div key={appt.id} style={{ padding: '1.25rem', border: '1px solid #F3F4F6', borderRadius: '18px', background: '#F9FAFB', display: 'flex', alignItems: 'center', gap: '1.2rem', transition: 'all 0.2s ease' }} className="table-row-hover">
                                                <div style={{ width: '50px', height: '50px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                                                    {appt.patientName.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{appt.patientName}</div>
                                                    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                        <span>📅 {new Date(appt.appointmentDate).toLocaleDateString()}</span>
                                                        <span>🕒 {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                    <button style={{ borderRadius: '10px', padding: '0 1.1rem', height: '40px', fontSize: '0.82rem', fontWeight: 700, background: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => openDetails(appt)}>Review</button>
                                                    <button style={{ borderRadius: '10px', padding: '0 1.1rem', height: '40px', fontSize: '0.82rem', fontWeight: 700, background: '#CFF971', border: 'none', color: '#0F2819', cursor: 'pointer', boxShadow: '0 2px 8px rgba(207,249,113,0.35)', transition: 'all 0.15s' }} onClick={() => handleApprove(appt.id)}>Confirm</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* My Schedules */}
                            {schedules.length > 0 && (
                                <div className="table-card" style={{ padding: '1.8rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1.4rem' }}>🗓️</span> Published Clinical Shifts
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {schedules.filter(s => {
                                            const shiftDate = new Date(s.scheduleDate);
                                            const today = new Date();
                                            const diffTime = today - shiftDate;
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return diffDays <= 7;
                                        }).map(s => (
                                            <div key={s.id} style={{ padding: '1rem 1.25rem', border: '1px solid #F3F4F6', borderRadius: '16px', background: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#111827' }}>{new Date(s.scheduleDate).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.2rem' }}>
                                                        {s.shiftStart} – {s.shiftEnd} &nbsp;·&nbsp; {s.consultationDuration} min sessions
                                                        {(s.breakStart && s.breakEnd) && <span style={{ marginLeft: '0.75rem', color: '#3b82f6' }}>☕ Break: {s.breakStart}–{s.breakEnd}</span>}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    {s.consultationFee && (
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Clinical Fee</div>
                                                            <div style={{ fontWeight: 800, color: '#059669' }}>LKR {s.consultationFee.toLocaleString()}</div>
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button onClick={() => handleEditScheduleBatch(s)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Edit</button>
                                                        <button onClick={() => handleDeleteSchedule(s.id)} style={{ background: '#FFF1F2', color: '#E11D48', border: 'none', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ALL APPOINTMENTS TAB ──────────────────────────────── */}
                    {activeTab === 'allappointments' && (
                        <div className="table-card" style={{ padding: '1.8rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                                <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '12px', color: '#111827' }}><ActivityIcon /></div>
                                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>All Appointments</h3>
                            </div>
                            {appointments.length === 0 ? (
                                <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '3rem', border: '2px dashed #F3F4F6', borderRadius: '18px' }}>
                                    No historical or upcoming records found.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {appointments.filter(appt => {
                                        const appointmentDate = new Date(appt.appointmentDate);
                                        const today = new Date();
                                        const diffTime = today - appointmentDate;
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        return diffDays <= 7;
                                    }).map(appt => {
                                        const s = STATUS_STYLE[appt.status] || STATUS_STYLE.PENDING;
                                        return (
                                            <div key={appt.id} style={{ padding: '1rem 1.25rem', border: '1px solid #F3F4F6', borderRadius: '16px', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }} className="table-row-hover">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#111827', fontSize: '1rem' }}>
                                                        {appt.patientName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#111827' }}>{appt.patientName}</div>
                                                        <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.2rem' }}>
                                                            📅 {new Date(appt.appointmentDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} &nbsp;·&nbsp; 🕒 {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '240px', flexShrink: 0, justifyContent: 'flex-end' }}>
                                                    <button style={{ width: '80px', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px', height: '36px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', color: '#2563EB', cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => openDetails(appt)}>Details</button>
                                                    <span style={{ width: '140px', flexShrink: 0, textAlign: 'center', padding: '0.35rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', background: s.bg, color: s.color, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── REVIEWS TAB ───────────────────────────────────────── */}
                    {activeTab === 'reviews' && (
                        <div className="table-card" style={{ padding: '1.8rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                                <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '12px', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HeartIcon /></div>
                                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>Patient Reviews</h3>
                            </div>
                            {patientReviews.length === 0 ? (
                                <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '3rem', border: '2px dashed #F3F4F6', borderRadius: '18px' }}>
                                    No reviews yet.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {patientReviews.map(review => (
                                        <div key={review.id} style={{ padding: '1.5rem', border: '1px solid #F3F4F6', borderRadius: '16px', background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.05rem' }}>{review.patientName}</div>
                                                <div style={{ color: '#F59E0B', fontSize: '1.2rem', letterSpacing: '2px' }}>
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
                                                "{review.comment}"
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                                {new Date(review.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ANALYTICS TAB ─────────────────────────────────────── */}
                    {activeTab === 'analytics' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                                <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '12px', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChartBarIcon /></div>
                                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 800 }}>Clinical Insights</h3>
                            </div>
                            <AnalyticsView appointments={appointments} schedules={schedules} />
                        </div>
                    )}
                </div>
            </main>

            {/* Profile Update Modal */}
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

                            <h2 style={{ color: '#111827', margin: 0, fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}>Update Clinical Profile</h2>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', margin: '0.25rem 0 0', fontWeight: 500, textAlign: 'center' }}>Dr. {user?.firstName} {user?.lastName} — {user?.email}</p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveProfile} style={{ padding: '1.6rem 2rem 2rem', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><span>📞</span><span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Contact Information</span></div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+94 77 123 4567" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E5E7EB', margin: '1.2rem 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><span>🏥</span><span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase' }}>Professional Credentials</span></div>
                            <div className="form-group">
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Specialization</label>
                                <select className="form-input" value={editForm.specialization} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }}>
                                    <option value="">Select Specialization</option>
                                    {SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Qualifications</label>
                                <input className="form-input" placeholder="e.g. MBBS, MD (Cardiology)" value={editForm.qualifications} onChange={e => setEditForm({ ...editForm, qualifications: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label className="form-label" style={{ color: '#4B5563', fontWeight: 600 }}>Years of Experience</label>
                                <input type="number" min="0" max="60" className="form-input" value={editForm.yearsOfExperience} onChange={e => setEditForm({ ...editForm, yearsOfExperience: e.target.value })} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }} />
                            </div>
                            <div className="form-group" style={{ background: 'rgba(207, 249, 113, 0.05)', padding: '1rem', borderRadius: '14px', border: '1.5px solid rgba(207, 249, 113, 0.2)', marginTop: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#0F2819', fontSize: '0.9rem' }}>Two-Step Verification</div>
                                        <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '0.1rem' }}>Secure your accounts with an OTP.</div>
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
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.8rem' }}>
                                <button type="button" onClick={() => setEditModalOpen(false)} style={{ flex: 1, borderRadius: '12px', height: '48px', fontWeight: 700, fontSize: '0.95rem', background: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#374151', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ flex: 1.5, borderRadius: '12px', background: '#0F2819', color: '#CFF971', height: '48px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {detailsModalOpen && selectedAppointment && (
                <div className="modal-overlay" onClick={() => setDetailsModalOpen(false)}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', padding: 0, borderRadius: '24px', overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
                        {/* Modal Hero Header — lime green theme matching Update Profile */}
                        <div style={{ background: '#CFF971', padding: '1.8rem 2rem 1.4rem', position: 'relative' }}>
                            <button type="button" onClick={() => setDetailsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15,40,25,0.08)', border: 'none', color: '#0F2819', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#0F2819', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#CFF971' }}>
                                    {selectedAppointment.patientName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(15,40,25,0.55)', marginBottom: '0.2rem' }}>Booking Detail</div>
                                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F2819' }}>{selectedAppointment.patientName}</h3>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', padding: '1.2rem', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                                <div>
                                    <div style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Appointment Date</div>
                                    <div style={{ fontWeight: 700, color: '#111827' }}>{new Date(selectedAppointment.appointmentDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#6B7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Start Time</div>
                                    <div style={{ fontWeight: 700, color: '#3b82f6' }}>{new Date(selectedAppointment.appointmentDate).toLocaleTimeString(undefined, { timeStyle: 'short' })}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>Reason for Visit</div>
                                <div style={{ padding: '1.2rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderLeft: '4px solid #CFF971', borderRadius: '12px', fontSize: '0.95rem', color: '#374151', lineHeight: '1.6' }}>
                                    {selectedAppointment.reason || 'No specific symptoms provided.'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {selectedAppointment.status === 'PENDING' ? (
                                    <>
                                        <button style={{ flex: 1, borderRadius: '14px', height: '50px', fontWeight: 800, fontSize: '1rem', background: '#CFF971', border: 'none', color: '#0F2819', cursor: 'pointer', boxShadow: '0 4px 14px rgba(207,249,113,0.4)', transition: 'all 0.2s' }} onClick={() => { handleApprove(selectedAppointment.id); setDetailsModalOpen(false); }}>Approve</button>
                                        <button style={{ flex: 1, borderRadius: '14px', height: '50px', fontWeight: 700, fontSize: '1rem', background: '#FFF1F2', border: '1.5px solid #FECDD3', color: '#E11D48', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => { handleReject(selectedAppointment.id); setDetailsModalOpen(false); }}>Reject</button>
                                    </>
                                ) : (
                                    <button style={{ width: '100%', borderRadius: '14px', height: '50px', fontWeight: 700, fontSize: '1rem', background: '#F3F4F6', border: 'none', color: '#374151', cursor: 'pointer' }} onClick={() => setDetailsModalOpen(false)}>Close Review</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ISSUE PRESCRIPTION MODAL */}
            {prescModalOpen && ( 
                <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content animate-in" style={{ maxWidth: '850px', width: '100%', padding: 0, borderRadius: '24px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
                        <div style={{ background: '#CFF971', padding: '1.8rem 2.2rem 1.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#0F2819', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📝</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(15,40,25,0.55)', marginBottom: '0.1rem' }}>Clinical Hub</div>
                                    <h3 style={{ margin: 0, color: '#0F2819', fontSize: '1.35rem', fontWeight: 800 }}>Digital Prescription Board</h3>
                                </div>
                            </div>
                            <button type="button" onClick={() => setPrescModalOpen(false)} style={{ background: 'rgba(15,40,25,0.08)', border: 'none', color: '#0F2819', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                        </div>

                        <form onSubmit={handleIssuePresc} style={{ padding: '2.2rem' }}>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                                {/* Patient Selector */}
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label className="form-label" style={{ fontWeight: 700, color: '#111827' }}>Recipient Patient</label>
                                    {selectedPatient ? (
                                        <div style={{ padding: '1rem', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#111827' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Ph: {selectedPatient.phone}</div>
                                            </div>
                                            <button type="button" onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>Change</button>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" className="form-input" placeholder="Search by name or phone..." value={patientSearch} onChange={e => handlePatientSearch(e.target.value)} style={{ paddingLeft: '2.5rem', background: '#F9FAFB' }} />
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                                            {patientResults.length > 0 && (
                                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                                    {patientResults.map(p => (
                                                        <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientResults([]); setPatientSearch(''); }} style={{ padding: '0.8rem 1.2rem', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }} className="table-row-hover">
                                                            <div style={{ fontWeight: 600, color: '#111827' }}>{p.firstName} {p.lastName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{p.phone || 'No phone recorded'}</div>
                                                        </div>
                                                    ))} 
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 700, color: '#111827' }}>Clinical Notes / Diagnosis</label>
                                    <textarea className="form-input" rows="2" style={{ resize: 'none', background: '#F9FAFB' }} placeholder="Provide clinical context or primary diagnosis..." value={newPresc.clinicalNotes} onChange={e => setNewPresc({ ...newPresc, clinicalNotes: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F3F4F6' }}>
                                    <h4 style={{ margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>💊</span> Medication Regimen</h4>
                                    <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '10px' }} onClick={addPrescItem}>+ Add Drug</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {newPresc.items.map((item, idx) => (
                                        <div key={idx} style={{ padding: '1.2rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr 0.4fr', gap: '0.8rem', alignItems: 'end' }}>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.3rem', display: 'block' }}>Medicine Name</label>
                                                <select className="form-input" required value={item.medicineId} onChange={e => { const items = [...newPresc.items]; items[idx].medicineId = e.target.value; setNewPresc({ ...newPresc, items }); }} style={{ background: '#FFFFFF' }}>
                                                    <option value="" disabled>Select drug...</option>
                                                    {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.3rem', display: 'block' }}>Dosage</label>
                                                <input className="form-input" placeholder="e.g. 500mg" required value={item.dosage} onChange={e => { const items = [...newPresc.items]; items[idx].dosage = e.target.value; setNewPresc({ ...newPresc, items }); }} style={{ background: '#FFFFFF' }} />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.3rem', display: 'block' }}>Frequency</label>
                                                <input className="form-input" placeholder="e.g. 1-0-1" required value={item.frequency} onChange={e => { const items = [...newPresc.items]; items[idx].frequency = e.target.value; setNewPresc({ ...newPresc, items }); }} style={{ background: '#FFFFFF' }} />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.3rem', display: 'block' }}>Duration</label>
                                                <input className="form-input" placeholder="e.g. 7 Days" required value={item.duration} onChange={e => { const items = [...newPresc.items]; items[idx].duration = e.target.value; setNewPresc({ ...newPresc, items }); }} style={{ background: '#FFFFFF' }} />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.3rem', display: 'block' }}>Qty</label>
                                                <input type="number" className="form-input" min="1" required value={item.totalQuantity} onChange={e => { const items = [...newPresc.items]; items[idx].totalQuantity = e.target.value; setNewPresc({ ...newPresc, items }); }} style={{ background: '#FFFFFF' }} />
                                            </div>
                                            <button type="button" onClick={() => { const items = [...newPresc.items]; items.splice(idx, 1); setNewPresc({ ...newPresc, items }); }} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '1.2rem', cursor: 'pointer', paddingBottom: '0.5rem' }}>🗑️</button>
                                        </div>
                                    ))} 
                                    {newPresc.items.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #E5E7EB', borderRadius: '16px', background: '#F9FAFB', color: '#9CA3AF' }}>
                                            No medications have been added to this prescription yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '3rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, borderRadius: '12px', height: '50px' }} onClick={() => setPrescModalOpen(false)}>Discard Draft</button>
                                <button 
                                    type="submit" 
                                    style={{ 
                                        flex: 2, 
                                        borderRadius: '16px', 
                                        height: '52px', 
                                        background: (issuing || newPresc.items.length === 0) ? '#E5E7EB' : '#CFF971', 
                                        color: (issuing || newPresc.items.length === 0) ? '#9CA3AF' : '#0F2819',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        border: 'none',
                                        cursor: (issuing || newPresc.items.length === 0) ? 'not-allowed' : 'pointer',
                                        boxShadow: (issuing || newPresc.items.length === 0) ? 'none' : '0 4px 16px rgba(207, 249, 113, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }} 
                                    onMouseEnter={e => { if(!issuing && newPresc.items.length > 0) { e.currentTarget.style.background = '#bfef6a'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(207,249,113,0.6)'; } }}
                                    onMouseLeave={e => { if(!issuing && newPresc.items.length > 0) { e.currentTarget.style.background = '#CFF971'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(207, 249, 113, 0.4)'; } }}
                                    disabled={issuing || newPresc.items.length === 0}
                                >
                                    {issuing ? 'Authorizing...' : '🔒 Review & Finalize Prescription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

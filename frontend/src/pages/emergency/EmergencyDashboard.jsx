import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, fill = "none", sw = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const HeartIcon = () => <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" size={28} />;
const AlertIcon = ({ size = 20 }) => <Icon d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={size} />;
const MapPinIcon = ({ size = 20 }) => <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" size={size} />;
const CheckCircleIcon = ({ size = 20 }) => <Icon d="M22 11.08V12a10 10 0 11-5.93-9.14" size={size} />;
const ClockIcon = ({ size = 20 }) => <Icon d="M12 6v6l4 2" size={size} />;
const LogOutIcon = () => <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={20} />;
const RefreshIcon = () => <Icon d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" size={18} />;
const TruckIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
);

export default function EmergencyDashboard() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ phone: '', twoFactorEnabled: false });
    const [saving, setSaving] = useState(false);
    const [profileImg, setProfileImg] = useState(null);
    const [activeTab, setActiveTab] = useState('live_alerts');
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({ pending: 0, responding: 0, resolved: 0 });
    const [ambulances, setAmbulances] = useState([]);
    const [ambulanceForm, setAmbulanceForm] = useState({ plateNumber: '', email: '', password: '' });
    const [addingAmbulance, setAddingAmbulance] = useState(false);
    const [responderLocation, setResponderLocation] = useState(null);

    // Calculate distance between two coordinates in km using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const fetchAmbulances = async () => {
        try {
            const res = await api.get('/v1/emergency/ambulances');
            setAmbulances(res.data);
        } catch (err) {
            console.error('Error fetching ambulances', err);
        }
    };

    const handleAddAmbulance = async (e) => {
        e.preventDefault();
        setAddingAmbulance(true);
        try {
            await api.post('/v1/emergency/ambulance/register', ambulanceForm);
            alert("Ambulance registered successfully!");
            setAmbulanceForm({ plateNumber: '', email: '', password: '' });
            fetchAmbulances();
        } catch (err) {
            console.error(err);
            alert("Failed to register ambulance. Email may already exist.");
        } finally {
            setAddingAmbulance(false);
        }
    };

    useEffect(() => {
        if (user) {
            setEditForm({
                phone: user.phone || '',
                twoFactorEnabled: user.twoFactorEnabled || false
            });
        }
    }, [user]);

    const [isSyncing, setIsSyncing] = useState(false);

    const fetchAlerts = async (manual = false) => {
        if (manual) setIsSyncing(true);
        try {
            const res = await api.get('/v1/emergency/alerts');
            setAlerts(res.data);
            
            // Calculate stats
            const s = { pending: 0, responding: 0, resolved: 0 };
            res.data.forEach(a => {
                if (a.status === 'PENDING') s.pending++;
                else if (a.status === 'RESPONDING') s.responding++;
                else if (a.status === 'RESOLVED') s.resolved++;
            });
            setStats(s);
        } catch (err) {
            console.error('Error fetching alerts:', err);
        } finally {
            if (manual) setTimeout(() => setIsSyncing(false), 500); // short delay for visual feedback
        }
    };

    useEffect(() => {
        fetchAlerts();
        fetchAmbulances();
        const interval = setInterval(fetchAlerts, 5000); // Poll every 5 seconds
        
        // Track the emergency responder's live location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setResponderLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, err => console.warn("Failed to get responder location:", err), { enableHighAccuracy: true });
        }

        return () => clearInterval(interval);
    }, []);

    const updateAlertStatus = async (id, status) => {
        try {
            const notes = prompt(`Enter notes for status: ${status}`) || 'Updated via dashboard';
            await api.patch(`/v1/emergency/alerts/${id}/status`, { status, notes });
            fetchAlerts();
        } catch (err) {
            console.error('Failed to update alert', err);
        }
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
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="dashboard-layout theme-workspace-light">
            <style>{`
                .emergency-card-pending {
                    border-left: 5px solid #ff4757;
                    animation: pulse-red 2s infinite;
                }
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 71, 87, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
                }
                .location-link {
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .location-link:hover { text-decoration: underline; }
            `}</style>

            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <aside className="sidebar">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="sidebar-logo">
                        <HeartIcon />
                        <span>CareLink</span>
                    </div>
                </Link>

                <nav className="sidebar-nav">
                    <div className="section-title">Emergency Center</div>
                    <button onClick={() => setActiveTab('live_alerts')} className={`sidebar-link ${activeTab === 'live_alerts' ? 'active' : ''}`}>
                        <AlertIcon /> Live Alerts
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}>
                        <ClockIcon /> History Logs
                    </button>
                    <button onClick={() => setActiveTab('fleet')} className={`sidebar-link ${activeTab === 'fleet' ? 'active' : ''}`}>
                        <TruckIcon /> Fleet Management
                    </button>
                </nav>

                <div className="sidebar-nav" style={{ flex: 'none', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                        <LogOutIcon /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-title">Welcome back, {user?.firstName || 'Responder'}</div>
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
                                user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'E'
                            )}
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    {activeTab !== 'fleet' && (
                        <>
                            {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Pending Alerts', value: stats.pending, color: '#ff4757', icon: <AlertIcon /> },
                            { label: 'Responding', value: stats.responding, color: '#f59e0b', icon: <ClockIcon /> },
                            { label: 'Resolved Today', value: stats.resolved, color: '#10b981', icon: <CheckCircleIcon /> }
                        ].map((s, i) => (
                            <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: s.color + '15', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="table-card animate-in">
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>
                                {activeTab === 'live_alerts' ? '🚨 Incoming Distress Signals' : '🗄️ Past Emergency History Logs'}
                            </h3>
                            {activeTab === 'live_alerts' ? (
                                <span style={{ fontSize: '0.8rem', color: '#ff4757', fontWeight: 800 }}>LIVE FEED ACTIVATED</span>
                            ) : (
                                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 800 }}>ARCHIVED VIEW</span>
                            )}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Patient Name</th>
                                        <th>Distress Time</th>
                                        <th>Location Coordinates</th>
                                        <th>Contact Details</th>
                                        <th>Current Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>No emergency alerts yet. Monitoring...</td></tr>
                                    ) : (
                                        alerts.filter(a => activeTab === 'live_alerts' ? a.status !== 'RESOLVED' : true).map(a => (
                                            <tr key={a.id} className={a.status === 'PENDING' ? 'emergency-card-pending' : ''}>
                                                <td>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{a.patient.firstName} {a.patient.lastName}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>PAT-ID: #{a.patient.id}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 700 }}>{new Date(a.timestamp).toLocaleTimeString()}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{new Date(a.timestamp).toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    {a.latitude ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${a.latitude},${a.longitude}`} target="_blank" rel="noreferrer" className="location-link">
                                                                <MapPinIcon size={16} /> View Map
                                                            </a>
                                                            {responderLocation && (
                                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff4757', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                                    🚑 {calculateDistance(responderLocation.lat, responderLocation.lng, a.latitude, a.longitude)} km away
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Location N/A</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{a.patient.phone || 'N/A'}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>EMERGENCY: {a.patient.emergencyContactPhone || 'N/A'}</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span className={`premium-pill ${a.status === 'PENDING' ? 'red' : a.status === 'RESPONDING' ? 'yellow' : 'green'}`}>
                                                            {a.status}
                                                        </span>
                                                        {a.responder && (
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4f46e5', background: '#e0e7ff', padding: '0.3rem 0.6rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                                🚑 Unit {a.responder.firstName}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'fleet' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    
                    <div className="table-card animate-in">
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ margin: 0 }}>🚑 Manage Fleet & Ambulances</h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6B7280' }}>Register new emergency responders / ambulances</p>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <form onSubmit={handleAddAmbulance}>
                                <div className="form-group">
                                    <label className="form-label">Ambulance Identifier (Plate / Name)</label>
                                    <input required type="text" className="form-input" value={ambulanceForm.plateNumber} onChange={e => setAmbulanceForm({...ambulanceForm, plateNumber: e.target.value})} placeholder="e.g. WP NA-1234 or Unit 01" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Login Email</label>
                                    <input required type="email" className="form-input" value={ambulanceForm.email} onChange={e => setAmbulanceForm({...ambulanceForm, email: e.target.value})} placeholder="driver@carelink.com" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input required type="password" className="form-input" value={ambulanceForm.password} onChange={e => setAmbulanceForm({...ambulanceForm, password: e.target.value})} placeholder="Secure password" />
                                </div>
                                <button type="submit" disabled={addingAmbulance} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                    {addingAmbulance ? 'Registering...' : 'Register Ambulance'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="table-card animate-in">
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ margin: 0 }}>Available Responders</h3>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {ambulances.length === 0 ? (
                                <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>No ambulances registered yet.</div>
                            ) : (
                                ambulances.map(amb => (
                                    <div key={amb.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TruckIcon />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#111827' }}>{amb.firstName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{amb.email}</div>
                                        </div>
                                        <span className="premium-pill green" style={{ marginLeft: 'auto' }}>Active</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </main>

            {/* Profile Update Modal */}
            {editModalOpen && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', background: '#fff', borderRadius: '24px', padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem' }}>Edit Team Profile</h3>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label className="form-label">Response Team Contact</label>
                                <input type="text" className="form-input" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setEditModalOpen(false)} className="btn" style={{ flex: 1, border: '1px solid #ddd' }}>Cancel</button>
                                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1, background: '#ff4757', border: 'none' }}>{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

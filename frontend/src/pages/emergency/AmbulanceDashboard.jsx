import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';

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

export default function AmbulanceDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);
    const [responderLocation, setResponderLocation] = useState(null);

    // Calculate distance between two coordinates in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/v1/emergency/alerts');
            const filteredAlerts = res.data.filter(a => 
                a.status === 'PENDING' || (a.status === 'RESPONDING' && a.responder?.id === user?.id)
            );
            setAlerts(filteredAlerts);
            
            // Set active alert only if it was assigned to THIS unit
            const mine = filteredAlerts.find(a => a.status === 'RESPONDING');
            if (mine) setActiveAlert(mine);
            else setActiveAlert(null);
        } catch (err) {
            console.error('Error fetching alerts:', err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000); 

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(pos => {
                setResponderLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, err => console.warn(err), { enableHighAccuracy: true });
        }

        return () => clearInterval(interval);
    }, []);

    const updateAlertStatus = async (id, status) => {
        try {
            const notes = status === 'RESPONDING' ? `Unit ${user?.firstName} dispatched` : 'Patient reached and stabilized';
            await api.patch(`/v1/emergency/alerts/${id}/status`, { status, notes });
            fetchAlerts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="dashboard-layout theme-workspace-light" style={{ background: '#f0f2f5' }}>
            <style>{`
                .ambulance-card { background: #fff; border-radius: 24px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 1.5rem; border: 1px solid #eee; }
                .pulse-red { animation: pulse-red 2s infinite; border: 2px solid #ff4757; }
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(255, 71, 87, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
                }
                .btn-dispatch { background: #ff4757; color: #fff; border: none; padding: 1rem; border-radius: 15px; font-weight: 800; width: 100%; cursor: pointer; transition: 0.3s; }
                .btn-dispatch:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .btn-resolve { background: #10b981; color: #fff; border: none; padding: 1rem; border-radius: 15px; font-weight: 800; width: 100%; cursor: pointer; }
                .nav-btn { background: #3b82f6; color: #fff; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; border-radius: 15px; font-weight: 700; }
            `}</style>

            <main className="main-content" style={{ marginLeft: 0, width: '100%', padding: '1rem' }}>
                <header className="topbar" style={{ borderRadius: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#ff4757', color: '#fff', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.8rem' }}>
                            UNIT {user?.firstName}
                        </div>
                        <div className="topbar-title" style={{ fontSize: '1rem' }}>Emergency Responder Mode</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <NotificationBell light />
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}><LogOutIcon /></button>
                    </div>
                </header>

                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {activeAlert ? (
                        <div className="ambulance-card pulse-red">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ background: '#ff475715', color: '#ff4757', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>ACTIVE DISTRESS SIGNAL</span>
                                    <h2 style={{ margin: '0.5rem 0 0' }}>{activeAlert.patient.firstName} {activeAlert.patient.lastName}</h2>
                                    <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>Contact: {activeAlert.patient.phone}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ff4757' }}>
                                        {calculateDistance(responderLocation?.lat, responderLocation?.lng, activeAlert.latitude, activeAlert.longitude)} km
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af' }}>STATED DISTANCE</div>
                                </div>
                            </div>
                            
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.3rem' }}>PATIENT LOCATION</div>
                                <div style={{ fontWeight: 700 }}>{activeAlert.latitude}, {activeAlert.longitude}</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeAlert.latitude},${activeAlert.longitude}`} target="_blank" rel="noreferrer" className="nav-btn">
                                    <MapPinIcon size={20} /> Open Navigation
                                </a>
                                <button onClick={() => updateAlertStatus(activeAlert.id, 'RESOLVED')} className="btn-resolve">
                                    <CheckCircleIcon size={20} /> Mark Resolved
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                                <CheckCircleIcon size={40} />
                            </div>
                            <h2 style={{ margin: 0 }}>System Online</h2>
                            <p style={{ color: '#6B7280' }}>Waiting for incoming distress signals...</p>
                        </div>
                    )}

                    <h3 style={{ margin: '2rem 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertIcon size={18} /> Available Pending Alerts ({alerts.filter(a => a.status === 'PENDING').length})
                    </h3>

                    {alerts.filter(a => a.status === 'PENDING').length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', border: '2px dashed #ddd', borderRadius: '24px' }}>
                            No other pending emergencies.
                        </div>
                    ) : (
                        alerts.filter(a => a.status === 'PENDING').map(a => (
                            <div key={a.id} className="ambulance-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>{a.patient.firstName} {a.patient.lastName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Dura: {calculateDistance(responderLocation?.lat, responderLocation?.lng, a.latitude, a.longitude)} km away</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(a.timestamp).toLocaleTimeString()}</div>
                                </div>
                                <button onClick={() => updateAlertStatus(a.id, 'RESPONDING')} className="btn-dispatch">
                                    Dispatch This Unit
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

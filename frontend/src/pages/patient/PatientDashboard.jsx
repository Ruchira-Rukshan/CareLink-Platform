import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

function LogOutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    );
}

export default function PatientDashboard() {
    const { user, loading, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: '', address: '', allergies: '',
        emergencyContactName: '', emergencyContactPhone: ''
    });
    const [saving, setSaving] = useState(false);

    // Load existing user data into form
    React.useEffect(() => {
        if (user) {
            setEditForm({
                phone: user.phone || '',
                address: user.address || '',
                allergies: user.allergies || '',
                emergencyContactName: user.emergencyContactName || '',
                emergencyContactPhone: user.emergencyContactPhone || ''
            });
        }
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(editForm);
            setEditModalOpen(false);
            window.location.reload(); // Quick refresh to clear states if needed
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout animate-in">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <HeartIcon />
                    <span>CareLink</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="section-title">Patient Panel</div>
                    <button className="sidebar-link active">
                        <UserIcon /> Profile Overview
                    </button>
                    <button className="sidebar-link">
                        <CalendarIcon /> Appointments
                    </button>
                    <button className="sidebar-link">
                        <ActivityIcon /> Symptom Log
                    </button>
                    <button className="sidebar-link">
                        <FileTextIcon /> Medical History
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
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-title">Welcome back, {user?.name || 'Patient'}</div>
                    <div className="flex items-center gap-3">
                        <div className="badge badge-patient">Patient Portal</div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,198,167,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-card-label">Upcoming Appointments</div>
                            <div className="stat-card-value">0</div>
                            <div className="badge badge-pending mt-2" style={{ alignSelf: 'flex-start' }}>Book Now</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">Recent Prescriptions</div>
                            <div className="stat-card-value">2</div>
                            <div className="badge badge-active mt-2" style={{ alignSelf: 'flex-start' }}>Active</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">Symptoms Logged</div>
                            <div className="stat-card-value">5</div>
                            <div className="text-secondary mt-2 text-sm" style={{ fontSize: '0.8rem' }}>Last 30 days</div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Personal Details</h3>
                            <div className="p-4 bg-input rounded-lg border border-border" style={{ padding: '1.2rem', background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name</div>
                                        <div className="font-medium">{user?.name || 'Not Available'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email</div>
                                        <div className="font-medium">{user?.email || 'Not Available'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Role</div>
                                        <div className="badge badge-patient mt-1">Patient</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</div>
                                        <div className="badge badge-active mt-1">Verified</div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone</div>
                                        <div className="font-medium">{user?.phone || 'Not Available'}</div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Address</div>
                                        <div className="font-medium">{user?.address || 'Not Available'}</div>
                                    </div>
                                </div>
                                <button className="btn btn-outline mt-3 w-full" style={{ width: '100%' }} onClick={() => setEditModalOpen(true)}>Update Profile</button>
                            </div>
                        </div>

                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                            <div className="grid gap-3" style={{ display: 'grid', gap: '0.8rem' }}>
                                <button className="btn btn-primary" style={{ margin: 0 }}>Book an Appointment</button>
                                <button className="btn btn-outline">Log New Symptom</button>
                                <button className="btn btn-outline">View Medical Records</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Profile Update Modal */}
            {editModalOpen && (
                <div className="modal-overlay" onClick={() => setEditModalOpen(false)} style={{ display: 'flex' }}>
                    <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Update Profile Details</h2>
                            <button className="btn btn-ghost" onClick={() => setEditModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label className="form-label">Phone Number</label>
                                <input className="form-input" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Home Address</label>
                                <textarea className="form-input" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} rows={3} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Allergies (comma separated)</label>
                                <input className="form-input" value={editForm.allergies} onChange={e => setEditForm({ ...editForm, allergies: e.target.value })} placeholder="e.g. Peanuts, Penicillin" />
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label className="form-label">Emergency Contact Name</label>
                                    <input className="form-input" value={editForm.emergencyContactName} onChange={e => setEditForm({ ...editForm, emergencyContactName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Emergency Contact Phone</label>
                                    <input className="form-input" value={editForm.emergencyContactPhone} onChange={e => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

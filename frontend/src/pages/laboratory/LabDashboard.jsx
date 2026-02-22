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

function FlaskIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3v15.82a2 2 0 0 0 1.11 1.79l.89.44a2 2 0 0 0 1.79 0l.89-.44A2 2 0 0 0 15 18.82V3" />
            <path d="M7 3h10" />
            <path d="M9 11h6" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
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

export default function LabDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                    <div className="section-title">Laboratory Hub</div>
                    <button className="sidebar-link active">
                        <FlaskIcon /> Lab Dashboard
                    </button>
                    <button className="sidebar-link">
                        <ListIcon /> Pending Tests
                    </button>
                    <button className="sidebar-link">
                        <ListIcon /> Published Results
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
                    <div className="topbar-title">Welcome back, {user?.firstName || 'Lab Tech'}</div>
                    <div className="flex items-center gap-3">
                        <div className="badge badge-doctor" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>Technician</div>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold border" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontWeight: 'bold' }}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'L'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-card-label">Pending Tests</div>
                            <div className="stat-card-value">8</div>
                            <div className="badge badge-pending mt-2" style={{ alignSelf: 'flex-start' }}>Awaiting processing</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">In Progress</div>
                            <div className="stat-card-value">3</div>
                            <div className="badge badge-active mt-2" style={{ alignSelf: 'flex-start', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>Currently analyzing</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">Results Published</div>
                            <div className="stat-card-value">24</div>
                            <div className="text-secondary mt-2 text-sm" style={{ fontSize: '0.8rem' }}>Sent to doctors</div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Laboratory Profile</h3>
                            <div className="p-4 bg-input rounded-lg border border-border" style={{ padding: '1.2rem', background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Facility</div>
                                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email</div>
                                        <div className="font-medium">{user?.email || 'Not Available'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Role</div>
                                        <div className="badge badge-doctor mt-1" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>Technician</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</div>
                                        <div className="badge badge-active mt-1">Operational</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                            <div className="grid gap-3" style={{ display: 'grid', gap: '0.8rem' }}>
                                <button className="btn btn-primary" style={{ margin: 0 }}>View Pending Test Orders</button>
                                <button className="btn btn-outline">Enter Test Results</button>
                                <button className="btn btn-outline">Publish Completed Reports</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

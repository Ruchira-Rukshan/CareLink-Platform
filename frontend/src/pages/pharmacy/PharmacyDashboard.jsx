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

function PillIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.8 11.3 2 22l10.7-3.8" />
            <path d="M4 3h.01" />
            <path d="M22 8h.01" />
            <path d="M15 2h.01" />
            <path d="M22 20h.01" />
            <path d="m22 2-2.2 2.2" />
            <path d="m17.8 13.8-3.6-3.6" />
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

export default function PharmacyDashboard() {
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
                    <div className="section-title">Pharmacy Hub</div>
                    <button className="sidebar-link active">
                        <PillIcon /> Pharmacy Dashboard
                    </button>
                    <button className="sidebar-link">
                        <ListIcon /> Pending Prescriptions
                    </button>
                    <button className="sidebar-link">
                        <ListIcon /> Inventory Management
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
                    <div className="topbar-title">Welcome back, {user?.firstName || 'Pharmacist'}</div>
                    <div className="flex items-center gap-3">
                        <div className="badge badge-doctor" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Pharmacist</div>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold border" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 'bold' }}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-card-label">Pending Prescriptions</div>
                            <div className="stat-card-value">12</div>
                            <div className="badge badge-pending mt-2" style={{ alignSelf: 'flex-start' }}>Requires attention</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">Low Stock Items</div>
                            <div className="stat-card-value">5</div>
                            <div className="badge badge-active mt-2" style={{ alignSelf: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Reorder needed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-label">Dispensed Today</div>
                            <div className="stat-card-value">48</div>
                            <div className="text-secondary mt-2 text-sm" style={{ fontSize: '0.8rem' }}>Successfully processed</div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Pharmacy Profile</h3>
                            <div className="p-4 bg-input rounded-lg border border-border" style={{ padding: '1.2rem', background: 'var(--bg-input)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Name</div>
                                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email</div>
                                        <div className="font-medium">{user?.email || 'Not Available'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Role</div>
                                        <div className="badge badge-doctor mt-1" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Pharmacist</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-secondary" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</div>
                                        <div className="badge badge-active mt-1">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-card p-4" style={{ padding: '1.5rem' }}>
                            <h3 className="mb-4" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                            <div className="grid gap-3" style={{ display: 'grid', gap: '0.8rem' }}>
                                <button className="btn btn-primary" style={{ margin: 0 }}>Review Pending Prescriptions</button>
                                <button className="btn btn-outline">Check Inventory Levels</button>
                                <button className="btn btn-outline">Generate Dispensing Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

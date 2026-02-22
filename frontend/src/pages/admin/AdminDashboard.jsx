import React from 'react';
import AdminLayout from './AdminLayout';

const STATS = [
    { icon: '🧑‍⚕️', label: 'Total Patients', value: '—', color: '#4f8ef7' },
    { icon: '👨‍⚕️', label: 'Registered Doctors', value: '—', color: 'var(--primary)' },
    { icon: '💊', label: 'Pharmacists', value: '—', color: 'var(--warning)' },
    { icon: '🏭', label: 'Suppliers', value: '—', color: '#9b7eff' },
];

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard">
            <div className="animate-in">
                <h2 style={{ marginBottom: '0.3rem' }}>Welcome back 👋</h2>
                <p style={{ marginBottom: '1.5rem' }}>Here's an overview of the CareLink platform.</p>

                <div className="stat-cards">
                    {STATS.map((s) => (
                        <div className="stat-card" key={s.label} style={{ borderColor: `${s.color}33` }}>
                            <div className="stat-card-icon">{s.icon}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-card-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="table-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Quick Navigation</h3>
                    <p>Use the sidebar to manage users, review doctor applications, and administer the platform.</p>
                </div>
            </div>
        </AdminLayout>
    );
}

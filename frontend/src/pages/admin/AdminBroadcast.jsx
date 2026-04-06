import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const ROLES = [
    { value: 'PATIENT', label: 'Patients', color: '#4f8ef7' },
    { value: 'DOCTOR', label: 'Doctors', color: '#92400e' },
    { value: 'SUPPLIER', label: 'Suppliers', color: '#9b7eff' },
    { value: 'LAB_TECH', label: 'Lab Technicians', color: '#db2777' },
    { value: 'PHARMACIST', label: 'Pharmacists', color: '#f59e0b' },
];

export default function AdminBroadcast() {
    const [formData, setFormData] = useState({
        subject: '',
        title: '',
        message: '',
        roles: []
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const toggleRole = (role) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(role) 
                ? prev.roles.filter(r => r !== role) 
                : [...prev.roles, role]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.roles.length === 0) {
            alert('Please select at least one recipient group.');
            return;
        }

        setLoading(true);
        setSuccess(null);
        try {
            await api.post('/v1/admin/broadcast/email', formData);
            setSuccess('Broadcast initiated successfully! Emails are being sent in the background.');
            setFormData({ subject: '', title: '', message: '', roles: [] });
        } catch (error) {
            console.error('Broadcast failed:', error);
            alert('Failed to initiate broadcast. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="Broadcast Communication">
            <div className="animate-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ marginBottom: '0.3rem', color: '#111827' }}>Bulk Email Broadcaster</h2>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Send professional announcements and updates to specific user groups across the platform.</p>
                </div>

                {success && (
                    <div className="alert alert-success" style={{ marginBottom: '2rem', padding: '1.2rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {success}
                    </div>
                )}

                <div className="table-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Select Recipient Groups</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {ROLES.map(role => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => toggleRole(role.value)}
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '12px',
                                            border: `2px solid ${formData.roles.includes(role.value) ? role.color : '#E5E7EB'}`,
                                            background: formData.roles.includes(role.value) ? `${role.color}10` : 'transparent',
                                            color: formData.roles.includes(role.value) ? role.color : '#6B7280',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '10px', height: '10px', borderRadius: '50%', 
                                            background: role.color, 
                                            opacity: formData.roles.includes(role.value) ? 1 : 0.3 
                                        }} />
                                        {role.label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, roles: ROLES.map(r => r.value) }))}
                                    style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: 'none', background: '#111827', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                    Select All
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Email Subject (Inbox Preview)</label>
                            <input
                                type="text"
                                className="form-input"
                                required
                                placeholder="e.g., Important Security Update for All CareLink Users"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Main Header / Title (Inside Email Body)</label>
                            <input
                                type="text"
                                className="form-input"
                                required
                                placeholder="e.g., New Platform Security Features"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label className="form-label">Detailed Message Content</label>
                            <textarea
                                className="form-input"
                                required
                                rows="8"
                                placeholder="Type your message here. Use clear, professional language..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: 'auto', padding: '1rem 3rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '18px', height: '18px' }} />
                                        Processing Broadcast...
                                    </>
                                ) : (
                                    <>
                                        <MailIcon />
                                        Send Broadcast Email
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

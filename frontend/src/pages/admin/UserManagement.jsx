import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const ROLES = ['All', 'PATIENT', 'DOCTOR', 'PHARMACIST', 'SUPPLIER', 'ADMIN'];

const ROLE_BADGES = {
    PATIENT: 'badge-patient',
    DOCTOR: 'badge-doctor',
    PHARMACIST: 'badge-pharmacist',
    SUPPLIER: 'badge-supplier',
    ADMIN: 'badge-admin',
};

const ROLE_LABELS = {
    PATIENT: 'Patient', DOCTOR: 'Doctor', PHARMACIST: 'Pharmacist',
    SUPPLIER: 'Supplier', ADMIN: 'Admin',
};

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/v1/users');
            setUsers(res.data);
        } catch (err) {
            setError('Failed to load users. ' + (err.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const toggleBan = async (user) => {
        setActionLoading(user.id);
        try {
            const res = await api.post(`/v1/users/${user.id}/ban`);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
        } catch {
            // Show nothing for now
        } finally {
            setActionLoading(null);
        }
    };

    const approveUser = async (user) => {
        setActionLoading(user.id);
        try {
            const res = await api.post(`/v1/users/${user.id}/approve`);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
        } catch {
            // Error handling ignored for simplicity
        } finally {
            setActionLoading(null);
        }
    };

    const rejectUser = async (user) => {
        if (!window.confirm(`Are you sure you want to reject and delete ${user.firstName} ${user.lastName}?`)) return;
        setActionLoading(user.id);
        try {
            await api.delete(`/v1/users/${user.id}`);
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
        } catch {
            // Ignored
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = users.filter((u) => {
        const matchRole = filter === 'All' || u.role === filter;
        const matchSearch = !search ||
            u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    // Stats
    const stats = {
        PATIENT: users.filter((u) => u.role === 'PATIENT').length,
        DOCTOR: users.filter((u) => u.role === 'DOCTOR').length,
        PHARMACIST: users.filter((u) => u.role === 'PHARMACIST').length,
        SUPPLIER: users.filter((u) => u.role === 'SUPPLIER').length,
        ADMIN: users.filter((u) => u.role === 'ADMIN').length,
    };

    return (
        <AdminLayout title="User Management">
            <div className="animate-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <h2 style={{ marginBottom: '0.2rem' }}>User Management</h2>
                        <p>Manage all registered users across the platform</p>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {users.length} total users
                    </span>
                </div>

                {/* Stats Row */}
                <div className="stat-cards" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                    {Object.entries(ROLE_LABELS).map(([role, label]) => (
                        <div key={role} className="stat-card" style={{ cursor: 'pointer', padding: '0.9rem' }} onClick={() => setFilter(role)}>
                            <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{stats[role]}</div>
                            <div className="stat-card-label">{label}s</div>
                        </div>
                    ))}
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠ {error}</div>}

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        className="form-input"
                        placeholder="🔍  Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: 280, marginBottom: 0 }}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {ROLES.map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilter(r)}
                                className="btn btn-outline"
                                style={{
                                    padding: '0.4rem 0.9rem',
                                    fontSize: '0.82rem',
                                    borderColor: filter === r ? 'var(--primary)' : undefined,
                                    color: filter === r ? 'var(--primary)' : undefined,
                                    background: filter === r ? 'var(--primary-glow)' : undefined,
                                }}
                            >
                                {r === 'All' ? 'All' : ROLE_LABELS[r]}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-outline" onClick={fetchUsers} style={{ marginLeft: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                        🔄 Refresh
                    </button>
                </div>

                {/* Table */}
                <div className="table-card">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            <div className="spinner" /> Loading users...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
                            <p>No users found</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, idx) => (
                                    <tr key={user.id}>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0
                                                }}>
                                                    {user.username?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{user.username || '—'}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.email || '—'}</td>
                                        <td>
                                            <span className={`badge ${ROLE_BADGES[user.role] || ''}`}>
                                                {ROLE_LABELS[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {!user.approved && user.role === 'DOCTOR' ? (
                                                <span className="badge badge-pending">Pending Approval</span>
                                            ) : (
                                                <span className={`badge ${user.banned ? 'badge-banned' : 'badge-active'}`}>
                                                    {user.banned ? 'Banned' : 'Active'}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.4rem', borderBottom: 'none' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                👁️ View
                                            </button>

                                            {!user.approved && user.role === 'DOCTOR' && (
                                                <>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                                                        onClick={() => approveUser(user)}
                                                        disabled={actionLoading === user.id}
                                                    >
                                                        {actionLoading === user.id ? '...' : '✅ Approve'}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                        onClick={() => rejectUser(user)}
                                                        disabled={actionLoading === user.id}
                                                    >
                                                        {actionLoading === user.id ? '...' : '❌ Reject'}
                                                    </button>
                                                </>
                                            )}

                                            {user.approved && (
                                                <button
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.3rem 0.6rem',
                                                        fontSize: '0.8rem',
                                                        borderColor: user.banned ? 'var(--success)' : 'var(--danger)',
                                                        color: user.banned ? 'var(--success)' : 'var(--danger)',
                                                    }}
                                                    onClick={() => toggleBan(user)}
                                                    disabled={actionLoading === user.id || user.role === 'ADMIN'}
                                                    title={user.role === 'ADMIN' ? 'Cannot ban admin users' : ''}
                                                >
                                                    {actionLoading === user.id ? '...' : user.banned ? '✓ Unban' : '⛔ Ban'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Details Modal */}
                {selectedUser && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedUser(null)}>
                        <div className="modal-content animate-in" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <h3>User Details</h3>
                                <button className="btn btn-ghost" onClick={() => setSelectedUser(null)} style={{ padding: '0.2rem 0.5rem' }}>✕</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div><small style={{ color: 'var(--text-muted)' }}>Name</small><div>{selectedUser.firstName} {selectedUser.lastName}</div></div>
                                <div><small style={{ color: 'var(--text-muted)' }}>Email</small><div>{selectedUser.email}</div></div>
                                <div><small style={{ color: 'var(--text-muted)' }}>Phone</small><div>{selectedUser.phone || 'N/A'}</div></div>
                                <div><small style={{ color: 'var(--text-muted)' }}>Role</small><div><span className={`badge ${ROLE_BADGES[selectedUser.role]}`}>{ROLE_LABELS[selectedUser.role]}</span></div></div>

                                {selectedUser.role === 'DOCTOR' && (
                                    <>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Specialization</small><div>{selectedUser.specialization || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>License Number</small><div>{selectedUser.medicalLicenseNumber || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Experience</small><div>{selectedUser.yearsOfExperience ? `${selectedUser.yearsOfExperience} years` : 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Qualifications</small><div>{selectedUser.qualifications || 'N/A'}</div></div>

                                        {selectedUser.certificatePath && (
                                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                                <small style={{ color: 'var(--text-muted)' }}>MBBS / Medical Certificate</small>
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <a href={`/api/v1/uploads/certificate/${selectedUser.certificatePath}`} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`/api/v1/uploads/certificate/${selectedUser.certificatePath}`}
                                                            alt="Medical Certificate"
                                                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                        />
                                                    </a>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                                        ⇧ Click image to view full size
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedUser.role === 'PATIENT' && (
                                    <>
                                        <div><small style={{ color: 'var(--text-muted)' }}>National ID</small><div>{selectedUser.nationalId || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Blood Group</small><div>{selectedUser.bloodGroup || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>DOB</small><div>{selectedUser.dob || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Gender</small><div>{selectedUser.gender || 'N/A'}</div></div>
                                        <div style={{ gridColumn: '1 / -1' }}><small style={{ color: 'var(--text-muted)' }}>Address</small><div>{selectedUser.address || 'N/A'}</div></div>
                                        <div style={{ gridColumn: '1 / -1' }}><small style={{ color: 'var(--text-muted)' }}>Allergies</small><div>{selectedUser.allergies || 'None'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Emergency Contact</small><div>{selectedUser.emergencyContactName || 'N/A'}</div></div>
                                        <div><small style={{ color: 'var(--text-muted)' }}>Emergency Phone</small><div>{selectedUser.emergencyContactPhone || 'N/A'}</div></div>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <button className="btn btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

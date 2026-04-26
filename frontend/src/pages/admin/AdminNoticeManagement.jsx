import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

const AnnouncementIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" />
        <path d="M22 12h-4" />
        <path d="M14 12h-4" />
        <path d="M18 16h-4" />
        <path d="M18 8h-4" />
    </svg>
);

export default function AdminNoticeManagement() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', active: true });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/v1/notices');
            setNotices(res.data);
        } catch (error) {
            console.error('Failed to fetch notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingNotice) {
                await api.put(`/v1/notices/${editingNotice.id}`, formData);
            } else {
                await api.post('/v1/notices', formData);
            }
            setShowModal(false);
            fetchNotices();
        } catch (error) {
            alert('Failed to save notice. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            await api.delete(`/v1/notices/${id}`);
            fetchNotices();
        } catch (error) {
            alert('Failed to delete notice.');
        }
    };

    const openEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({ title: notice.title, content: notice.content, active: notice.active });
        setShowModal(true);
    };

    return (
        <AdminLayout title="Notice Management">
            <div className="animate-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ maxWidth: '600px' }}>
                        <h2 style={{ marginBottom: '0.3rem', color: '#111827' }}>Notice Management</h2>
                        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Create and manage special announcements for the landing page hero section.</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        style={{ 
                            width: 'auto', 
                            padding: '0.7rem 1.5rem', 
                            fontSize: '0.9rem', 
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onClick={() => { setEditingNotice(null); setFormData({ title: '', content: '', active: true }); setShowModal(true); }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Post New Notice
                    </button>
                </div>

                <div className="table-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                    <table className="premium-table" style={{ borderSpacing: '0 0.8rem' }}>
                        <thead>
                            <tr>
                                <th style={{ background: 'transparent' }}>Status</th>
                                <th style={{ background: 'transparent' }}>Title</th>
                                <th style={{ background: 'transparent' }}>Content Snippet</th>
                                <th style={{ background: 'transparent' }}>Created At</th>
                                <th style={{ textAlign: 'center', background: 'transparent' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center" style={{ border: 'none', background: 'transparent' }}>Loading notices...</td></tr>
                            ) : notices.length === 0 ? (
                                <tr><td colSpan="5" className="text-center" style={{ border: 'none', background: 'transparent' }}>No notices found. Add your first one!</td></tr>
                            ) : notices.map(notice => (
                                <tr key={notice.id}>
                                    <td style={{ border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                        <span className={`premium-pill ${notice.active ? 'green' : 'yellow'}`}>
                                            {notice.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 700, border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>{notice.title}</td>
                                    <td style={{ color: '#6B7280', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                        {notice.content}
                                    </td>
                                    <td style={{ color: '#6B7280', fontSize: '0.85rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                            <button className="action-icon-btn edit" title="Edit" onClick={() => openEdit(notice)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button className="action-icon-btn delete" title="Delete" onClick={() => handleDelete(notice.id)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-in" style={{ maxWidth: '600px' }}>
                        <div className="table-card" style={{ padding: '2.5rem', background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#111827' }}>
                                    {editingNotice ? 'Edit Special Notice' : 'Post New Special Notice'}
                                </h2>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6B7280' }}
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Notice Title</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        required
                                        placeholder="e.g., Free Vaccination Clinic"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        style={{ background: '#F3F4F6 !important', color: '#111827 !important' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Content / Message</label>
                                    <textarea 
                                        className="form-input" 
                                        required
                                        rows="4"
                                        placeholder="Enter the full announcement text here..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        style={{ background: '#F3F4F6 !important', color: '#111827 !important', resize: 'none' }}
                                    ></textarea>
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                    <input 
                                        type="checkbox" 
                                        id="activeStatus"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="activeStatus" style={{ cursor: 'pointer', fontWeight: 600, color: '#4B5563' }}>
                                        Mark as Active (Visible on site)
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline" 
                                        style={{ flex: 1, margin: 0 }}
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        style={{ flex: 2, margin: 0 }}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Processing...' : editingNotice ? 'Update Notice' : 'Publish Notice'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

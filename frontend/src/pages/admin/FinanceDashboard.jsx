import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';

export default function FinanceDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFinanceData();

        // Auto-refresh every 30 seconds for "real-time" data
        const interval = setInterval(() => {
            fetchFinanceData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchFinanceData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/v1/admin/finance/summary');
            setData(res.data);
        } catch (err) {
            setError('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <AdminLayout title="Financial Overview">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                <p>Loading financial insights...</p>
            </div>
        </AdminLayout>
    );

    if (error) return (
        <AdminLayout title="Financial Overview">
            <div className="alert alert-error">{error}</div>
        </AdminLayout>
    );

    if (!data) return null;

    return (
        <AdminLayout title="Financial Overview">
            <div className="animate-in">
                {/* Monthly Performance Header */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
                        Monthly Revenue Analysis — <span style={{ color: '#3b82f6' }}>{data.currentMonth}</span>
                    </h2>
                </div>

                {/* Top Statistics */}
                <div className="stat-cards" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="stat-card" style={{ background: '#3b82f6', color: '#ffffff', borderColor: 'transparent' }}>
                        <div className="stat-card-label" style={{ color: '#ffffff', opacity: 0.8 }}>Current Month Total</div>
                        <div className="stat-card-value" style={{ color: '#ffffff' }}>LKR {(data?.monthlyTotal || 0).toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">Doctor Fees (Monthly)</div>
                        <div className="stat-card-value" style={{ color: '#059669' }}>LKR {(data?.doctorMonthly || 0).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.4rem' }}>All-time: LKR {(data?.doctorTotal || 0).toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-label">Pharmacy Sales (Monthly)</div>
                        <div className="stat-card-value" style={{ color: '#059669' }}>LKR {(data?.pharmacyMonthly || 0).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.4rem' }}>All-time: LKR {(data?.pharmacyTotal || 0).toLocaleString()}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#f9fafb' }}>
                        <div className="stat-card-label">Lab Revenue (Monthly)</div>
                        <div className="stat-card-value" style={{ color: '#059669' }}>LKR {(data?.labMonthly || 0).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.4rem' }}>Overall Total: LKR {(data?.grandTotal || 0).toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Doctor Revenue Breakdown */}
                    <div className="table-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3b82f6' }}>🩺</div>
                            <h3 style={{ margin: 0 }}>Revenue by Doctor</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Doctor Name</th>
                                        <th style={{ textAlign: 'right' }}>This Month (LKR)</th>
                                        <th style={{ textAlign: 'right' }}>Total Earned (LKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data?.doctorBreakdown || {}).map(([name, amount]) => (
                                        <tr key={name}>
                                            <td style={{ fontWeight: 600 }}>{name}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#3b82f6' }}>
                                                {(data?.doctorMonthlyBreakdown?.[name] || 0).toLocaleString()}
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                                                {amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {Object.keys(data?.doctorBreakdown || {}).length === 0 && (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No doctor revenue found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lab Test Revenue Breakdown */}
                    <div className="table-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '10px', color: '#a855f7' }}>🔬</div>
                            <h3 style={{ margin: 0 }}>Revenue by Lab Test</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Test Name</th>
                                        <th style={{ textAlign: 'right' }}>This Month (LKR)</th>
                                        <th style={{ textAlign: 'right' }}>Total Revenue (LKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data?.labBreakdown || {}).map(([name, amount]) => (
                                        <tr key={name}>
                                            <td style={{ fontWeight: 600 }}>{name}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#a855f7' }}>
                                                {(data?.labMonthlyBreakdown?.[name] || 0).toLocaleString()}
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                                                {amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {Object.keys(data?.labBreakdown || {}).length === 0 && (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No lab revenue found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

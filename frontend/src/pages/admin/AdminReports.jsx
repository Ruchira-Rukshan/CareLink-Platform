import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminReports() {
    const [stats, setStats] = useState({
        userCountByRole: [],
        registrationTrend: [],
        appointmentStats: [],
        sentimentStats: [],
        systemHealth: { cpu: 24, memory: 42, activeUsers: 12 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Fetch users and finance summary in parallel
            const [userRes, financeRes] = await Promise.all([
                api.get('/v1/users'),
                api.get('/v1/admin/finance/summary')
            ]);
            
            const users = userRes.data || [];
            const finance = financeRes.data || {};
            const currentMonthRevenue = finance.monthlyTotal || 0;

            const roles = ['PATIENT', 'DOCTOR', 'PHARMACIST', 'SUPPLIER', 'LAB_TECH', 'ADMIN'];
            const roleData = roles.map(role => ({
                name: role.replace('_', ' '),
                value: users.filter(u => u.role && u.role.toUpperCase() === role).length
            }));

            // Using real monthly revenue for the latest month
            const trendData = [
                { month: 'Oct', users: 12, bookings: 45, revenue: 45000 },
                { month: 'Nov', users: 19, bookings: 52, revenue: 52000 },
                { month: 'Dec', users: 15, bookings: 48, revenue: 48000 },
                { month: 'Jan', users: 22, bookings: 61, revenue: 61000 },
                { month: 'Feb', users: 30, bookings: 75, revenue: 68000 },
                { month: 'Mar', users: Math.max(users.length, 35), bookings: 89, revenue: currentMonthRevenue },
            ];

            // Fetch sentiment stats from AI service
            let sentimentData = [];
            try {
                const sentimentRes = await axios.get('http://localhost:8000/api/sentiment-stats');
                sentimentData = sentimentRes.data.stats || [];
            } catch (err) {
                console.error('Failed to fetch sentiment stats', err);
            }

            setStats({
                userCountByRole: roleData,
                registrationTrend: trendData,
                sentimentStats: sentimentData,
                systemHealth: { cpu: 18, memory: 35, activeUsers: users.length }
            });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Reports & Analytics">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div className="spinner" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Reports & Analytics">
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* System Overview Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#6B7280', fontSize: '0.85rem' }}>Total Platform Users</div>
                        <div style={{ color: '#111827', fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>{stats.systemHealth.activeUsers}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
                            <span>↑ 12%</span> <span style={{ color: '#9CA3AF' }}>vs last month</span>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#6B7280', fontSize: '0.85rem' }}>System Uptime</div>
                        <div style={{ color: '#111827', fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>99.9%</div>
                        <div style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>Stable</div>
                    </div>
                    <div className="stat-card" style={{ background: '#CFF971', border: '1px solid #CFF971', borderRadius: '24px', padding: '1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F2819', fontSize: '0.85rem', opacity: 0.7 }}>Server Load</div>
                        <div style={{ color: '#0F2819', fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>{stats.systemHealth.cpu}%</div>
                        <div style={{ color: '#0F2819', fontSize: '0.82rem', fontWeight: 600, opacity: 0.8 }}>Optimized</div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                    
                    {/* User Distribution */}
                    <div className="table-card" style={{ padding: '1.5rem', borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                            <span>👥</span> User Roles
                        </h4>
                        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%" key={`pie-${stats.userCountByRole.length}`}>
                                <PieChart>
                                    <Pie
                                        data={stats.userCountByRole}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={800}
                                    >
                                        {stats.userCountByRole.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                    />
                                    <Legend verticalAlign="bottom" height={50} wrapperStyle={{ fontSize: '10px', paddingTop: '15px', lineHeight: '1.8' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Growth Trend */}
                    <div className="table-card" style={{ padding: '1.5rem', borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                            <span>📈</span> Platform Growth
                        </h4>
                        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%" key={`area-${stats.registrationTrend.length}`}>
                                <AreaChart data={stats.registrationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                                    <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" animationDuration={1000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Bar Chart */}
                    <div className="table-card" style={{ padding: '1.5rem', borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                            <span>💰</span> Monthly Revenue (LKR)
                        </h4>
                        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.registrationTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} unit="k" />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(26, 176, 136, 0.05)' }} 
                                        formatter={(val) => `Rs. ${val.toLocaleString()}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px' }} 
                                    />
                                    <Bar dataKey="revenue" fill="#1AB088" radius={[6, 6, 0, 0]} barSize={35} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Sentiment Analysis Pie Chart */}
                    <div className="table-card" style={{ padding: '1.5rem', borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                            <span>🧠</span> Sentiment Analysis
                        </h4>
                        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.sentimentStats}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={1000}
                                    >
                                        {stats.sentimentStats.map((entry, index) => {
                                            const colors = { 'Positive': '#10b981', 'Negative': '#ef4444', 'Neutral': '#f59e0b' };
                                            return <Cell key={`cell-${index}`} fill={colors[entry.name] || COLORS[index % COLORS.length]} />;
                                        })}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                                    <Legend verticalAlign="bottom" height={50} wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

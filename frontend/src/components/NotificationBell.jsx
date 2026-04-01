import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = '/api';

export default function NotificationBell({ light = false }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
            // Polling every 30 seconds
            const interval = setInterval(() => {
                fetchUnreadCount();
                if (isOpen) fetchNotifications();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [user, isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API}/v1/notifications`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            setNotifications(res.data);
        } catch (e) { console.error('Error fetching notifications', e); }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get(`${API}/v1/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            setUnreadCount(res.data.count);
        } catch (e) { console.error('Error fetching unread count', e); }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API}/v1/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (e) { console.error('Error marking as read', e); }
    };

    const markAllRead = async () => {
        try {
            await axios.patch(`${API}/v1/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('cl_token')}` }
            });
            fetchNotifications();
            fetchUnreadCount();
        } catch (e) { console.error('Error marking all read', e); }
    };

    if (!user) return null;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: light ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                    border: light ? '1.5px solid rgba(0, 0, 0, 0.08)' : '1.5px solid rgba(207, 249, 113, 0.2)',
                    borderRadius: '12px',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: isOpen ? (light ? '#0C2216' : '#CFF971') : (light ? '#374151' : '#fff'),
                    boxShadow: isOpen ? (light ? '0 0 10px rgba(0,0,0,0.1)' : '0 0 15px rgba(207, 249, 113, 0.3)') : 'none',
                    outline: 'none'
                }}
                onMouseOver={e => { 
                    e.currentTarget.style.borderColor = light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(207, 249, 113, 0.5)'; 
                    e.currentTarget.style.background = light ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'; 
                }}
                onMouseOut={e => { 
                    if(!isOpen) { 
                        e.currentTarget.style.borderColor = light ? 'rgba(0, 0, 0, 0.08)' : 'rgba(207, 249, 113, 0.2)'; 
                        e.currentTarget.style.background = light ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)'; 
                    } 
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: '800',
                        borderRadius: '8px',
                        padding: '1px 4px',
                        border: light ? '2px solid #fff' : '2px solid #0a1e14',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        minWidth: '18px',
                        textAlign: 'center'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '55px',
                    right: '0',
                    width: '340px',
                    background: 'rgba(10, 30, 20, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(207, 249, 113, 0.25)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    zIndex: 2000,
                    maxHeight: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'dropdownIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <style>{`
                        @keyframes dropdownIn {
                            from { opacity: 0; transform: translateY(10px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        .notif-scroll::-webkit-scrollbar { width: 5px; }
                        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
                        .notif-scroll::-webkit-scrollbar-thumb { background: rgba(207, 249, 113, 0.3); borderRadius: 10px; }
                    `}</style>

                    <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <div style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: 800 }}>Notifications</div>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#CFF971', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(207, 249, 113, 0.1)'}
                                onMouseOut={e => e.currentTarget.style.background = 'none'}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notif-scroll" style={{ overflowY: 'auto', flex: 1 }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.95rem' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>🔔</div>
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((n, idx) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.isRead && markAsRead(n.id)}
                                    style={{
                                        padding: '1.2rem 1.5rem',
                                        borderBottom: idx < notifications.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                        background: n.isRead ? 'transparent' : 'rgba(207, 249, 113, 0.04)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                                    onMouseOut={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(207, 249, 113, 0.04)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: n.isRead ? 'rgba(255, 255, 255, 0.9)' : '#fff' }}>
                                            {n.title}
                                        </div>
                                        {!n.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CFF971', boxShadow: '0 0 8px #CFF971', marginTop: '4px' }} />}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.5', marginBottom: '0.6rem' }}>
                                        {n.message}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 600 }}>
                                        {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

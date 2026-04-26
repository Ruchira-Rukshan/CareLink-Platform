import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch full user profile from backend
    const fetchProfile = async () => {
        try {
            const res = await api.get('/v1/users/me');
            setUser(res.data);
            localStorage.setItem('cl_user', JSON.stringify(res.data));
            return res.data;
        } catch {
            return null;
        }
    };

    // Rehydrate on mount from token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('cl_token');
        if (token) {
            // Immediately try to fetch fresh profile
            api.get('/v1/users/me')
                .then(res => {
                    setUser(res.data);
                    localStorage.setItem('cl_user', JSON.stringify(res.data));
                })
                .catch(() => {
                    localStorage.removeItem('cl_token');
                    localStorage.removeItem('cl_user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (username, password) => {
        const res = await api.post('/v1/auth/login', { username, password });
        
        if (res.data.requires2fa) {
            return res.data; // Let the Login page handle redirect to OTP
        }

        const { token } = res.data;
        if (!token) {
            return res.data; // Handle success but no JWT (unapproved)
        }
        localStorage.setItem('cl_token', token);

        // Now fetch full profile immediately after extracting token
        const fullProfile = await fetchProfile();
        return { user: fullProfile, token, ...res.data };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('cl_token');
        localStorage.removeItem('cl_user');
        localStorage.removeItem('cl_role');
        setUser(null);
    }, []);

    const verify2fa = useCallback(async (username, code) => {
        const res = await api.post('/v1/auth/verify-2fa', { username, code });
        const { token } = res.data;
        if (!token) {
            return res.data; // Success but no JWT (pending approval)
        }
        localStorage.setItem('cl_token', token);
        const fullProfile = await fetchProfile();
        return { user: fullProfile, token, ...res.data };
    }, []);

    const updateProfile = async (data) => {
        try {
            const res = await api.put('/v1/users/me', data);
            setUser(res.data);
            localStorage.setItem('cl_user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, verify2fa }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

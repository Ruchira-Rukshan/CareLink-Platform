import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientRegister from './pages/register/PatientRegister';
import DoctorRegister from './pages/register/DoctorRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import LabDashboard from './pages/laboratory/LabDashboard';
import LandingPage from './pages/LandingPage';

function PrivateRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="auth-page"><div className="spinner" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/login" replace />;
    return children;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="auth-page"><div className="spinner" /></div>;
    if (user) {
        if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
        if (user.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
        if (user.role === 'PHARMACIST') return <Navigate to="/pharmacy/dashboard" replace />;
        if (user.role === 'LAB_TECH') return <Navigate to="/lab/dashboard" replace />;
        return <Navigate to="/patient/dashboard" replace />;
    }
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/register/patient" element={<PublicRoute><PatientRegister /></PublicRoute>} />
                    <Route path="/register/doctor" element={<PublicRoute><DoctorRegister /></PublicRoute>} />

                    {/* Admin */}
                    <Route path="/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                    <Route path="/admin/users" element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />

                    {/* Patient */}
                    <Route path="/patient/dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />

                    {/* Doctor */}
                    <Route path="/doctor/dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />

                    {/* Pharmacy */}
                    <Route path="/pharmacy/dashboard" element={<PrivateRoute><PharmacyDashboard /></PrivateRoute>} />

                    {/* Laboratory */}
                    <Route path="/lab/dashboard" element={<PrivateRoute><LabDashboard /></PrivateRoute>} />

                    {/* Landing Page & Fallbacks */}
                    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

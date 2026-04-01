import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const TermsOfService = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'general';

    const renderContent = () => {
        switch (type.toLowerCase()) {
            case 'patient':
                return (
                    <>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Patient Terms & Conditions</h1>
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Personal Health Information</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                By using CareLink, you agree to share your medical history, allergies, and contact details with authorized healthcare providers on the platform. We ensure your data is encrypted and handled according to healthcare privacy standards.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. Appointment Responsibility</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                You are responsible for showing up for scheduled appointments. Cancellations must be made within the timeframes specified by the respective healthcare provider.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Medical Accuracy</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                While CareLink facilitates healthcare, the accuracy of medical advice, prescriptions, and lab results is the sole responsibility of the practicing professional or entity.
                            </p>
                        </section>
                    </>
                );
            case 'doctor':
                return (
                    <>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Doctor Terms of Service</h1>
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Professional Conduct</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Doctors registered on CareLink must maintain active medical licenses and adhere to the highest standards of professional ethics. You are responsible for the advice and prescriptions provided through the platform.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. Data Privacy</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Access to patient data is strictly for medical consultation purposes. Storing or using patient data outside the platform without explicit consent is strictly prohibited.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Platform Commissions</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                CareLink may charge a platform fee for bookings facilitated through our service. These fees will be communicated and deducted as per the agreed service level agreement.
                            </p>
                        </section>
                    </>
                );
            case 'supplier':
                return (
                    <>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Supplier & Vendor Terms</h1>
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Product Quality</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Suppliers must ensure that all pharmaceutical or medical supplies delivered through CareLink meet national quality standards and have valid expiry dates.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. Fulfillment Timelines</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Vendors are expected to fulfill orders within the promised timeframe. Repeated delays may result in platform suspension.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Business Registration</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                You must maintain a valid business registration and VAT/Tax clearance to operate as a supplier on our portal.
                            </p>
                        </section>
                    </>
                );
            default:
                return (
                    <>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>General Terms of Service</h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Welcome to CareLink. Please read these terms and conditions carefully as they govern your use of the platform.
                        </p>
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>1. Platform Use</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                The platform provides healthcare management features, including appointment booking, lab results viewing, and prescription storage. It is not intended as an emergency response service.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>2. User Responsibilities</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                You agree to provide accurate information when registering and using the platform and to keep your credentials confidential. You are responsible for all activity on your account.
                            </p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem', color: '#CFF971' }}>3. Professional Services</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Doctors, laboratories, and pharmacies on CareLink are independent professionals. While we verify credentials, CareLink does not guarantee results or medical outcomes from these third-party providers.
                            </p>
                        </section>
                    </>
                );
        }
    };

    const getBackPath = () => {
        switch (type.toLowerCase()) {
            case 'patient': return '/register/patient';
            case 'doctor': return '/register/doctor';
            case 'supplier': return '/register/supplier';
            default: return '/register';
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0a191c', color: '#fff', padding: '4rem 5%' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to={getBackPath()} style={{ color: '#CFF971', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Registration
                </Link>
                {renderContent()}
            </div>
        </div>
    );
};

export default TermsOfService;

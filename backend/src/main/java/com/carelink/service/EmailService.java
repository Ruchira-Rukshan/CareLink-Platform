package com.carelink.service;

import com.carelink.entity.LabReport;
import com.carelink.entity.Appointment;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendResetPasswordEmail(String toEmail, String token) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        
        String subject = "CareLink - Reset Your Password";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;'>" +
                "<h2 style='color: #10b981;'>CareLink Password Recovery</h2>" +
                "<p>We received a request to reset your password. If you didn't request this, you can ignore this email.</p>" +
                "<p>This link will expire in 15 minutes.</p>" +
                "<a href='" + resetLink + "' style='display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a>" +
                "<p style='margin-top: 20px; font-size: 0.8rem; color: #888;'>Alternatively, copy and paste this link: " + resetLink + "</p>" +
                "</div>";

        sendEmail(toEmail, subject, content);
    }

    @Async
    public void sendTwoFactorCodeEmail(String toEmail, String code) {
        String subject = "CareLink - Your Verification Code";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;'>" +
                "<h2 style='color: #10b981;'>CareLink Two-Step Verification</h2>" +
                "<p>Use the following code to complete your sign-in. This code is valid for 5 minutes.</p>" +
                "<div style='background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;'>" +
                "<span style='font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #0F373A;'>" + code + "</span>" +
                "</div>" +
                "<p style='font-size: 0.85rem; color: #666;'>If you didn't try to sign in to CareLink, please secure your account.</p>" +
                "</div>";

        sendEmail(toEmail, subject, content);
    }

    @Async
    public void sendAppointmentConfirmation(Appointment appt) {
        String patientEmail = appt.getPatient().getEmail();
        String doctorName = "Dr. " + appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName();
        String apptTime = appt.getAppointmentDate().toString();

        String subject = "Appointment Confirmed - CareLink";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #CFF971; border-radius: 10px;'>" +
                "<h2 style='color: #0F373A;'>Appointment Confirmed! ✨</h2>" +
                "<p>Your appointment has been successfully confirmed at <b>CareLink</b>.</p>" +
                "<div style='background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><b>Doctor:</b> " + doctorName + "</p>" +
                "<p style='margin: 5px 0;'><b>Date & Time:</b> " + apptTime + "</p>" +
                "</div>" +
                "<p>We look forward to seeing you. Please arrive 10 minutes early.</p>" +
                "<p style='font-size: 0.85rem; color: #666;'>If you need to cancel, please do so at least 24 hours in advance via your dashboard.</p>" +
                "</div>";

        sendEmail(patientEmail, subject, content);
    }

    @Async
    public void sendNewAppointmentToDoctor(Appointment appt) {
        String doctorEmail = appt.getDoctor().getEmail();
        String patientName = appt.getPatientFullName() != null ? appt.getPatientFullName() : appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName();
        String apptTime = appt.getAppointmentDate().toString();

        String subject = "New Appointment Confirmed - CareLink";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #3b82f6; border-radius: 10px;'>" +
                "<h2 style='color: #1e3a8a;'>New Appointment Confirmed! 📅</h2>" +
                "<p>A new appointment has been booked and paid for in your schedule.</p>" +
                "<div style='background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><b>Patient:</b> " + patientName + "</p>" +
                "<p style='margin: 5px 0;'><b>Date & Time:</b> " + apptTime + "</p>" +
                "<p style='margin: 5px 0;'><b>Reason:</b> " + (appt.getReason() != null ? appt.getReason() : "General Checkup") + "</p>" +
                "</div>" +
                "<p>Please check your doctor dashboard for more details.</p>" +
                "</div>";

        sendEmail(doctorEmail, subject, content);
    }

    @Async
    public void sendLabBookingConfirmation(LabReport report) {
        String patientEmail = report.getPatient().getEmail();
        String testName = report.getLabTest().getName();
        String apptTime = report.getLabSlot().getTestTime().toString();
        String ref = report.getBookingReference();

        String subject = "Lab Test Confirmed - CareLink";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #CFF971; border-radius: 10px;'>" +
                "<h2 style='color: #0F373A;'>Lab Booking Confirmed! 🧪</h2>" +
                "<p>Your lab test has been successfully confirmed at <b>CareLink Diagnostics</b>.</p>" +
                "<div style='background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><b>Test:</b> " + testName + "</p>" +
                "<p style='margin: 5px 0;'><b>Date & Time:</b> " + apptTime + "</p>" +
                "<p style='margin: 5px 0;'><b>Reference:</b> " + ref + "</p>" +
                "</div>" +
                (report.getLabTest().isFastingRequired() ? "<p style='color: #d97706;'><b>⚠️ Fasting Required:</b> Please do not eat or drink anything (except water) for 12 hours before your test.</p>" : "") +
                "<p>Please bring your digital booking reference or NIC when you arrive.</p>" +
                "</div>";

        sendEmail(patientEmail, subject, content);
    }

    @Async
    public void sendNewLabBookingToTech(LabReport report) {
        if (report.getLabSlot().getLabTech() == null) return;
        String techEmail = report.getLabSlot().getLabTech().getEmail();
        String patientName = report.getPatient().getFirstName() + " " + report.getPatient().getLastName();
        String testName = report.getLabTest().getName();
        String apptTime = report.getLabSlot().getTestTime().toString();

        String subject = "New Lab Booking - CareLink";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #3b82f6; border-radius: 10px;'>" +
                "<h2 style='color: #1e3a8a;'>New Lab Booking 🏥</h2>" +
                "<p>A new lab test has been booked in your schedule.</p>" +
                "<div style='background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><b>Patient:</b> " + patientName + "</p>" +
                "<p style='margin: 5px 0;'><b>Test:</b> " + testName + "</p>" +
                "<p style='margin: 5px 0;'><b>Time:</b> " + apptTime + "</p>" +
                "</div>" +
                "</div>";

        sendEmail(techEmail, subject, content);
    }

    @Async
    public void sendLabCancellationEmail(LabReport report) {
        String patientEmail = report.getPatient().getEmail();
        String testName = report.getLabTest().getName();
        String apptTime = report.getLabSlot().getTestTime().toString();

        String subject = "Lab Booking Cancelled - CareLink";
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #ef4444; border-radius: 10px;'>" +
                "<h2 style='color: #991b1b;'>Lab Booking Cancelled</h2>" +
                "<p>Your booking for <b>" + testName + "</b> on " + apptTime + " has been cancelled.</p>" +
                "<p>If a refund is applicable, it will be processed according to our policy.</p>" +
                "</div>";

        sendEmail(patientEmail, subject, content);
        
        // Notify tech too
        if (report.getLabSlot().getLabTech() != null) {
            String techEmail = report.getLabSlot().getLabTech().getEmail();
            String techSubject = "Lab Booking Cancelled (Alert) - CareLink";
            String techContent = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #ef4444; border-radius: 10px;'>" +
                    "<h2 style='color: #991b1b;'>Booking Cancelled</h2>" +
                    "<p>The booking for <b>" + testName + "</b> on " + apptTime + " for patient " + 
                    report.getPatient().getFirstName() + " " + report.getPatient().getLastName() + " has been cancelled.</p>" +
                    "</div>";
            sendEmail(techEmail, techSubject, techContent);
        }
    }

    @Async
    public void sendBroadcastEmail(String toEmail, String subject, String title, String body) {
        String content = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #1AB088; border-radius: 10px; max-width: 600px; margin: 0 auto;'>" +
                "<div style='border-bottom: 2px solid #CFF971; padding-bottom: 15px; margin-bottom: 20px;'>" +
                "<h1 style='color: #0F373A; font-size: 24px; margin: 0;'>CareLink Announcement</h1>" +
                "</div>" +
                "<h2 style='color: #1AB088;'>" + title + "</h2>" +
                "<div style='line-height: 1.6; color: #374151; font-size: 16px;'>" +
                body.replace("\n", "<br/>") +
                "</div>" +
                "<div style='margin-top: 30px; padding-top: 15px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #9CA3AF;'>" +
                "This is a broadcast message from CareLink Administration. Please do not reply to this email." +
                "</div>" +
                "</div>";

        sendEmail(toEmail, subject, content);
    }

    @Async
    public void sendSimpleEmail(String toEmail, String subject, String content) {
        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Could not compose email: " + e.getMessage(), e);
        } catch (org.springframework.mail.MailException e) {
            throw new RuntimeException("Mail server error: " + e.getMessage(), e);
        }
    }
}

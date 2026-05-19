package com.dms.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp, String purpose) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom("DMS Portal <kashycodecrush4@gmail.com>");
            helper.setTo(to);
            
            String subject;
            String content;
            
            if ("REGISTER".equals(purpose)) {
                subject = "🔑 Complete Your DMS Portal Registration";
                content = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;\">" +
                        "  <div style=\"text-align: center; margin-bottom: 24px;\">" +
                        "    <h2 style=\"color: #8b5cf6; margin: 0; font-size: 24px;\">Welcome to DMS Portal</h2>" +
                        "    <p style=\"color: #718096; font-size: 14px; margin-top: 4px;\">Secure Document Management System</p>" +
                        "  </div>" +
                        "  <p style=\"font-size: 16px; line-height: 24px;\">Hello,</p>" +
                        "  <p style=\"font-size: 16px; line-height: 24px;\">Thank you for joining DMS Portal. To finalize your registration, please verify your identity using the One-Time Password (OTP) below:</p>" +
                        "  <div style=\"text-align: center; margin: 32px 0;\">" +
                        "    <span style=\"display: inline-block; font-family: monospace; font-size: 32px; font-weight: 800; color: #8b5cf6; letter-spacing: 6px; padding: 12px 30px; background-color: #f3f0ff; border: 1px dashed #c084fc; border-radius: 8px;\">" + otp + "</span>" +
                        "  </div>" +
                        "  <p style=\"font-size: 14px; color: #718096; line-height: 20px; margin-top: 24px;\">⚠️ <strong>Note:</strong> This verification code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>" +
                        "  <hr style=\"border: none; border-top: 1px solid #edf2f7; margin: 32px 0 24px 0;\" />" +
                        "  <p style=\"font-size: 12px; color: #a0aec0; text-align: center; margin: 0;\">© " + java.time.Year.now().getValue() + " DMS Portal. Protected by cryptographic security.</p>" +
                        "</div>";
            } else {
                subject = "🔒 Reset Your DMS Portal Password";
                content = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;\">" +
                        "  <div style=\"text-align: center; margin-bottom: 24px;\">" +
                        "    <h2 style=\"color: #8b5cf6; margin: 0; font-size: 24px;\">DMS Portal Security</h2>" +
                        "    <p style=\"color: #718096; font-size: 14px; margin-top: 4px;\">Password Recovery Services</p>" +
                        "  </div>" +
                        "  <p style=\"font-size: 16px; line-height: 24px;\">Hello,</p>" +
                        "  <p style=\"font-size: 16px; line-height: 24px;\">We received a request to recover the password for your DMS account. Use the verification code below to authorize the change:</p>" +
                        "  <div style=\"text-align: center; margin: 32px 0;\">" +
                        "    <span style=\"display: inline-block; font-family: monospace; font-size: 32px; font-weight: 800; color: #8b5cf6; letter-spacing: 6px; padding: 12px 30px; background-color: #f3f0ff; border: 1px dashed #c084fc; border-radius: 8px;\">" + otp + "</span>" +
                        "  </div>" +
                        "  <p style=\"font-size: 14px; color: #718096; line-height: 20px; margin-top: 24px;\">⚠️ <strong>Note:</strong> This verification code is valid for <strong>10 minutes</strong>. If you did not initiate this password reset, please secure your account immediately.</p>" +
                        "  <hr style=\"border: none; border-top: 1px solid #edf2f7; margin: 32px 0 24px 0;\" />" +
                        "  <p style=\"font-size: 12px; color: #a0aec0; text-align: center; margin: 0;\">© " + java.time.Year.now().getValue() + " DMS Portal. Protected by cryptographic security.</p>" +
                        "</div>";
            }
            
            helper.setSubject(subject);
            helper.setText(content, true); // true indicates HTML
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
            throw new com.dms.backend.exception.BadRequestException("SMTP ERROR: " + e.getMessage());
        }
    }
}

package com.dms.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String to, String otp, String purpose) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        if ("REGISTER".equals(purpose)) {
            message.setSubject("Your Registration OTP");
            message.setText("Welcome to DMS! Your OTP for registration is: " + otp + "\nThis OTP is valid for 10 minutes.");
        } else {
            message.setSubject("Your Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + "\nThis OTP is valid for 10 minutes.");
        }
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + " : " + e.getMessage());
        }
    }
}

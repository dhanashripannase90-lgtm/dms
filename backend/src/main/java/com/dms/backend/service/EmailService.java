package com.dms.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Year;

@Service
public class EmailService {

    @Value("${app.brevo.api-key}")
    private String brevoApiKey;

    public void sendOtpEmail(String to, String otp, String purpose) {
        String subject;
        String content;

        if ("REGISTER".equals(purpose)) {
            subject = "🔑 Complete Your DMS Portal Registration";
            content = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;\">"
                    +
                    "  <div style=\"text-align: center; margin-bottom: 24px;\">" +
                    "    <h2 style=\"color: #8b5cf6; margin: 0; font-size: 24px;\">Welcome to DMS Portal</h2>" +
                    "    <p style=\"color: #718096; font-size: 14px; margin-top: 4px;\">Secure Document Management System</p>"
                    +
                    "  </div>" +
                    "  <p style=\"font-size: 16px; line-height: 24px;\">Hello,</p>" +
                    "  <p style=\"font-size: 16px; line-height: 24px;\">Thank you for joining DMS Portal. To finalize your registration, please verify your identity using the One-Time Password (OTP) below:</p>"
                    +
                    "  <div style=\"text-align: center; margin: 32px 0;\">" +
                    "    <span style=\"display: inline-block; font-family: monospace; font-size: 32px; font-weight: 800; color: #8b5cf6; letter-spacing: 6px; padding: 12px 30px; background-color: #f3f0ff; border: 1px dashed #c084fc; border-radius: 8px;\">"
                    + otp + "</span>" +
                    "  </div>" +
                    "  <p style=\"font-size: 14px; color: #718096; line-height: 20px; margin-top: 24px;\">⚠️ <strong>Note:</strong> This verification code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>"
                    +
                    "  <hr style=\"border: none; border-top: 1px solid #edf2f7; margin: 32px 0 24px 0;\" />" +
                    "  <p style=\"font-size: 12px; color: #a0aec0; text-align: center; margin: 0;\">© "
                    + Year.now().getValue() + " DMS Portal. Protected by cryptographic security.</p>" +
                    "</div>";
        } else {
            subject = "🔒 Reset Your DMS Portal Password";
            content = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;\">"
                    +
                    "  <div style=\"text-align: center; margin-bottom: 24px;\">" +
                    "    <h2 style=\"color: #8b5cf6; margin: 0; font-size: 24px;\">DMS Portal Security</h2>" +
                    "    <p style=\"color: #718096; font-size: 14px; margin-top: 4px;\">Password Recovery Services</p>"
                    +
                    "  </div>" +
                    "  <p style=\"font-size: 16px; line-height: 24px;\">Hello,</p>" +
                    "  <p style=\"font-size: 16px; line-height: 24px;\">We received a request to recover the password for your DMS account. Use the verification code below to authorize the change:</p>"
                    +
                    "  <div style=\"text-align: center; margin: 32px 0;\">" +
                    "    <span style=\"display: inline-block; font-family: monospace; font-size: 32px; font-weight: 800; color: #8b5cf6; letter-spacing: 6px; padding: 12px 30px; background-color: #f3f0ff; border: 1px dashed #c084fc; border-radius: 8px;\">"
                    + otp + "</span>" +
                    "  </div>" +
                    "  <p style=\"font-size: 14px; color: #718096; line-height: 20px; margin-top: 24px;\">⚠️ <strong>Note:</strong> This verification code is valid for <strong>10 minutes</strong>. If you did not initiate this password reset, please secure your account immediately.</p>"
                    +
                    "  <hr style=\"border: none; border-top: 1px solid #edf2f7; margin: 32px 0 24px 0;\" />" +
                    "  <p style=\"font-size: 12px; color: #a0aec0; text-align: center; margin: 0;\">© "
                    + Year.now().getValue() + " DMS Portal. Protected by cryptographic security.</p>" +
                    "</div>";
        }

        try {
            if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
                System.err.println("BREVO_API_KEY is missing! Cannot send email to " + to);
                return;
            }

            // Using Brevo's v3 API
            String jsonPayload = String.format(
                    "{\"sender\": {\"name\": \"DMS Portal\", \"email\": \"dhanashripannase90@gmail.com\"}, " +
                    "\"to\": [{\"email\": \"%s\"}], " +
                    "\"subject\": \"%s\", \"htmlContent\": \"%s\"}",
                    to,
                    subject,
                    content.replace("\"", "\\\"").replace("\n", "") // Escape quotes and newlines for JSON payload
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", brevoApiKey)
                    .header("Content-Type", "application/json")
                    .header("accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            System.out.println("Brevo API Response Status: " + response.statusCode());
            System.out.println("Brevo API Response Body: " + response.body());

            if (response.statusCode() >= 400) {
                System.err.println("Failed to send email via Brevo: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("HTTP Email API failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

package com.aman.split_with_room_mates.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendPasswordResetEmail(String recipientEmail, String resetUrl) {
        String htmlContent = buildResetPasswordEmailHtml(resetUrl);

        logger.info("==========================================================");
        logger.info("PASSWORD RESET LINK GENERATED FOR USER: {}", recipientEmail);
        logger.info("RESET URL: {}", resetUrl);
        logger.info("==========================================================");

        boolean hasMailConfig = mailSender != null && mailUsername != null && !mailUsername.trim().isEmpty();

        if (!hasMailConfig) {
            logger.info("SMTP Credentials not configured. Email logged to console and available via Dev Mode link.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailUsername.trim());
            helper.setTo(recipientEmail.trim());
            helper.setSubject("Reset Your Bill Buddy Password");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Password reset email sent successfully to {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}. Error: {}", recipientEmail, e.getMessage());
            logger.info("Development Mode Reset Link: {}", resetUrl);
        }
    }

    private String buildResetPasswordEmailHtml(String resetUrl) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'><style>"
                + "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }"
                + ".container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }"
                + ".header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }"
                + ".header h1 { color: #4f46e5; margin: 8px 0 0 0; font-size: 24px; font-weight: 800; tracking-tight; }"
                + ".content { padding: 24px 0; font-size: 15px; line-height: 1.6; color: #334155; }"
                + ".btn-container { text-align: center; margin: 28px 0; }"
                + ".btn { background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2); }"
                + ".warning { background-color: #fffbe6; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #92400e; margin-top: 20px; }"
                + ".footer { text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }"
                + "</style></head>"
                + "<body>"
                + "<div class='container'>"
                + "  <div class='header'>"
                + "    <h1>💰 Bill-Buddy</h1>"
                + "    <p style='color: #64748b; font-size: 13px; margin-top: 4px;'>Scan • Track • Stay Ahead</p>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <p>Hello,</p>"
                + "    <p>We received a request to reset your password for your <strong>Bill-Buddy</strong> account.</p>"
                + "    <p>Click the button below to set up a new password:</p>"
                + "    <div class='btn-container'>"
                + "      <a href='" + resetUrl + "' class='btn'>Reset Password</a>"
                + "    </div>"
                + "    <div class='warning'>"
                + "      ⏳ <strong>Note:</strong> This link will expire in <strong>15 minutes</strong>."
                + "    </div>"
                + "    <p style='margin-top: 20px; font-size: 13px; color: #64748b;'>"
                + "      If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged."
                + "    </p>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + java.time.Year.now().getValue() + " Bill-Buddy. All rights reserved."
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
}

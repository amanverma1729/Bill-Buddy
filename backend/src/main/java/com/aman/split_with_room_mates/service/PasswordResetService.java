package com.aman.split_with_room_mates.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aman.split_with_room_mates.dto.PasswordResetToken;
import com.aman.split_with_room_mates.dto.User;
import com.aman.split_with_room_mates.repository.PasswordResetTokenRepository;
import com.aman.split_with_room_mates.repository.UserRepository;

@Service
public class PasswordResetService {

    private static final int EXPIRATION_MINUTES = 15;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public String createPasswordResetToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }

        Optional<User> userOptional = userRepository.findByEmail(email.trim());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Invalidate/delete existing reset tokens for this user
            tokenRepository.deleteByUser(user);

            // Generate cryptographically secure random token
            String rawToken = generateSecureToken();
            String tokenHash = hashToken(rawToken);

            // Create new token record
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setTokenHash(tokenHash);
            token.setExpiryDate(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
            token.setUsed(false);
            token.setCreatedAt(LocalDateTime.now());

            tokenRepository.save(token);

            // Build reset URL
            String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;

            // Send Email
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);

            return resetUrl;
        }

        return null;
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid password reset token.");
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be empty.");
        }

        String tokenHash = hashToken(rawToken.trim());
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByTokenHash(tokenHash);

        if (tokenOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid or expired password reset token.");
        }

        PasswordResetToken resetToken = tokenOptional.get();

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("This password reset link has already been used.");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset link has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(newPassword);
        userRepository.save(user);

        // Mark token as used and delete it
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        tokenRepository.delete(resetToken);
    }

    public static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes) + "-" + UUID.randomUUID().toString();
    }
}

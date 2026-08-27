package com.aman.split_with_room_mates.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aman.split_with_room_mates.dto.ApiResponse;
import com.aman.split_with_room_mates.dto.ForgotPasswordRequest;
import com.aman.split_with_room_mates.dto.ResetPasswordRequest;
import com.aman.split_with_room_mates.service.PasswordResetService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String resetUrl = passwordResetService.createPasswordResetToken(request.getEmail());
        String genericMsg = "If an account exists with this email, a password reset link has been sent.";
        return ResponseEntity.ok(new ApiResponse(true, genericMsg, resetUrl));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new ApiResponse(true, "Password has been reset successfully. You can now log in."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An error occurred while resetting the password. Please try again."));
        }
    }
}

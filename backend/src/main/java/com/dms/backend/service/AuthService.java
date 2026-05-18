package com.dms.backend.service;

import com.dms.backend.dto.AuthResponse;
import com.dms.backend.dto.LoginRequest;
import com.dms.backend.dto.RegisterRequest;
import com.dms.backend.entity.Role;
import com.dms.backend.entity.User;
import com.dms.backend.exception.BadRequestException;
import com.dms.backend.repository.UserRepository;
import com.dms.backend.security.CustomUserPrincipal;
import com.dms.backend.security.JwtService;
import com.dms.backend.dto.OtpRequest;
import com.dms.backend.dto.ResetPasswordRequest;
import com.dms.backend.entity.Otp;
import com.dms.backend.entity.OtpPurpose;
import com.dms.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OtpRepository otpRepository;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Otp otpEntity = otpRepository.findByEmailAndPurpose(request.getEmail(), OtpPurpose.REGISTER)
                .orElseThrow(() -> new BadRequestException("OTP not found. Please request an OTP first."));

        if (!otpEntity.getOtpCode().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }

        otpRepository.delete(otpEntity);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getRole().name(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getRole().name(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }

    public void requestOtp(OtpRequest request) {
        String email = request.getEmail();
        OtpPurpose purpose;
        try {
            purpose = OtpPurpose.valueOf(request.getPurpose().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid OTP purpose");
        }

        if (purpose == OtpPurpose.REGISTER && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already registered");
        }
        if (purpose == OtpPurpose.RESET_PASSWORD && !userRepository.existsByEmail(email)) {
            throw new BadRequestException("User not found");
        }

        // Delete any existing OTP for this email and purpose
        otpRepository.findByEmailAndPurpose(email, purpose).ifPresent(otpRepository::delete);

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        Otp otpEntity = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .purpose(purpose)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();
        
        otpRepository.save(otpEntity);
        emailService.sendOtpEmail(email, otpCode, purpose.name());
    }

    public void resetPassword(ResetPasswordRequest request) {
        Otp otpEntity = otpRepository.findByEmailAndPurpose(request.getEmail(), OtpPurpose.RESET_PASSWORD)
                .orElseThrow(() -> new BadRequestException("OTP not found. Please request an OTP first."));

        if (!otpEntity.getOtpCode().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        otpRepository.delete(otpEntity);
    }
}

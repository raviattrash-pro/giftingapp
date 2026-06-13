package com.giftconcierge.service;

import com.giftconcierge.dto.*;
import com.giftconcierge.exception.BadRequestException;
import com.giftconcierge.exception.DuplicateResourceException;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.exception.UnauthorizedException;
import com.giftconcierge.model.User;
import com.giftconcierge.model.PasswordReset;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.repository.PasswordResetRepository;
import com.giftconcierge.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.security.SecureRandom;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetRepository passwordResetRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, PasswordResetRepository passwordResetRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordResetRepository = passwordResetRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .avatarUrl(request.getAvatarUrl())
                .premium(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User logged in: {}", user.getEmail());
        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        SecureRandom random = new SecureRandom();
        int codeInt = 100000 + random.nextInt(900000);
        String code = String.valueOf(codeInt);

        passwordResetRepository.deleteByEmail(request.getEmail());

        PasswordReset passwordReset = PasswordReset.builder()
                .email(request.getEmail())
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        passwordResetRepository.save(passwordReset);

        System.out.println("=================================================");
        System.out.println("SIMULATED EMAIL: Verification code for " + request.getEmail() + " is " + code);
        System.out.println("=================================================");
        log.info("Verification code generated for {}: {}", request.getEmail(), code);

        return new MessageResponse("Verification code generated and logged successfully");
    }

    @Transactional(readOnly = true)
    public MessageResponse verifyCode(String email, String code) {
        PasswordReset reset = passwordResetRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> new BadRequestException("Invalid email or verification code"));

        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired");
        }

        return new MessageResponse("Code verified successfully");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordReset reset = passwordResetRepository.findByEmailAndCode(request.getEmail(), request.getCode())
                .orElseThrow(() -> new BadRequestException("Invalid email or verification code"));

        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetRepository.delete(reset);
            throw new BadRequestException("Verification code has expired");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordResetRepository.delete(reset);
        log.info("Password successfully reset for user: {}", request.getEmail());

        return new MessageResponse("Password reset successfully");
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .timezone(user.getTimezone())
                .monthlyBudget(user.getMonthlyBudget())
                .premium(user.getPremium())
                .role(user.getRole())
                .featureFlags(user.getFeatureFlags())
                .build();
    }
}

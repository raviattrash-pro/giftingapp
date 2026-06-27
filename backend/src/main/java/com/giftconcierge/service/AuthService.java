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
import java.util.Collections;
import java.util.Optional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetRepository passwordResetRepository;
    private final TwilioService twilioService;

    @Value("${google.client.id:placeholder}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, PasswordResetRepository passwordResetRepository, TwilioService twilioService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordResetRepository = passwordResetRepository;
        this.twilioService = twilioService;
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        String identifier = request.getEmail(); // Could be email or phone
        
        if (userRepository.existsByEmailOrPhone(identifier, identifier)) {
            throw new DuplicateResourceException("User", "email/phone", identifier);
        }

        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        boolean isPhone = !identifier.contains("@");
        
        User user = User.builder()
                .email(identifier) // Store in email column regardless
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(isPhone ? identifier : request.getPhone())
                .avatarUrl(request.getAvatarUrl())
                .premium(false)
                .isVerified(false)
                .otpCode(otp)
                .otpExpiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        user = userRepository.save(user);
        
        if (isPhone) {
            twilioService.sendOtp(identifier, otp);
            log.info("Sent Twilio SMS OTP to {}", identifier);
        } else {
            // MOCK: Print OTP to console instead of sending email
            log.info("MOCK - Registration Email OTP for {} is: {}", identifier, otp);
            System.out.println("MOCK - Registration Email OTP for " + identifier + " is: " + otp);
        }

        return new MessageResponse("Registration successful. Please verify your account with the OTP sent.");
    }

    @Transactional
    public AuthResponse verifyRegistration(String emailOrPhone, String otp) {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", emailOrPhone));

        if (user.getIsVerified()) {
            throw new BadRequestException("User is already verified.");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp) || user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired OTP.");
        }

        user.setIsVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User verified and logged in: {}", user.getEmail());
        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmailOrPhone(request.getEmail(), request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", request.getEmail()));

        if (user.getIsVerified() != null && !user.getIsVerified()) {
            throw new UnauthorizedException("Please verify your account before logging in.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("User logged in: {}", user.getEmail());
        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                Optional<User> userOpt = userRepository.findByEmail(email);
                User user;
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                } else {
                    user = User.builder()
                            .email(email)
                            .passwordHash("OAUTH")
                            .fullName(name != null ? name : "Google User")
                            .avatarUrl(pictureUrl)
                            .authProvider("GOOGLE")
                            .premium(false)
                            .isVerified(true)
                            .build();
                    user = userRepository.save(user);
                    log.info("Google User registered successfully: {}", email);
                }

                String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
                String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

                return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
            } else {
                throw new UnauthorizedException("Invalid ID token.");
            }
        } catch (Exception e) {
            log.error("Google authentication failed", e);
            throw new UnauthorizedException("Google authentication failed");
        }
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

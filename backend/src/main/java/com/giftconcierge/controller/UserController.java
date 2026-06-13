package com.giftconcierge.controller;

import com.giftconcierge.dto.UserResponse;
import com.giftconcierge.dto.MessageResponse;
import com.giftconcierge.security.UserPrincipal;
import com.giftconcierge.service.UserService;
import com.giftconcierge.repository.UserRepository;
import com.giftconcierge.model.User;
import com.giftconcierge.exception.BadRequestException;
import com.giftconcierge.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = userService.getCurrentUser(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserResponse request) {
        UserResponse response = userService.updateUser(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<UserResponse> updateAvatar(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> body) {
        UserResponse response = userService.updateAvatar(principal.getId(), body.get("avatarUrl"));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("New password cannot be empty");
        }
        
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
        
        if (oldPassword != null) {
            if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
                throw new BadRequestException("Old password does not match");
            }
        }
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }
}

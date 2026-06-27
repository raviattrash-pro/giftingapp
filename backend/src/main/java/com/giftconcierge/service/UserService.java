package com.giftconcierge.service;

import com.giftconcierge.dto.UserResponse;
import com.giftconcierge.exception.ResourceNotFoundException;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#userId")
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToResponse(user);
    }

    @Transactional
    @CachePut(value = "users", key = "#userId")
    public UserResponse updateUser(Long userId, UserResponse request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        if (request.getMonthlyBudget() != null) user.setMonthlyBudget(request.getMonthlyBudget());
        if (request.getFeatureFlags() != null) user.setFeatureFlags(request.getFeatureFlags());

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    @CachePut(value = "users", key = "#userId")
    public UserResponse updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
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

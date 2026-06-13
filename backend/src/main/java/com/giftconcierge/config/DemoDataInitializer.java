package com.giftconcierge.config;

import com.giftconcierge.model.Recipient;
import com.giftconcierge.model.User;
import com.giftconcierge.repository.RecipientRepository;
import com.giftconcierge.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class DemoDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RecipientRepository recipientRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataInitializer(UserRepository userRepository, RecipientRepository recipientRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.recipientRepository = recipientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // --- Admin user ---
        User admin = userRepository.findByEmail("concierge@corporategifts.com")
                .orElseGet(() -> User.builder()
                        .email("concierge@corporategifts.com")
                        .fullName("Concierge Admin")
                        .build());

        admin.setPasswordHash(passwordEncoder.encode("password123"));
        admin.setRole("ADMIN");
        admin.setPremium(true);
        admin.setMonthlyBudget(new BigDecimal("25000"));
        admin.setFeatureFlags(adminFeatureFlags());
        userRepository.save(admin);

        // --- Demo user ---
        User demoUser = userRepository.findByEmail("alex.jones@acme.com")
                .orElseGet(() -> User.builder()
                        .email("alex.jones@acme.com")
                        .fullName("Alex Jones")
                        .build());

        demoUser.setPasswordHash(passwordEncoder.encode("password123"));
        demoUser.setRole("USER");
        demoUser.setPremium(true);
        demoUser.setMonthlyBudget(new BigDecimal("10000"));
        demoUser.setFeatureFlags(defaultFeatureFlags());
        userRepository.save(demoUser);

        // --- Seed recipients for BOTH users if they have none ---
        seedRecipientsIfEmpty(admin);
        seedRecipientsIfEmpty(demoUser);
    }

    private void seedRecipientsIfEmpty(User user) {
        long count = recipientRepository.countByUser(user);
        if (count == 0) {
            recipientRepository.save(Recipient.builder().user(user).name("Eleanor Vance").relationship("Executive Client").build());
            recipientRepository.save(Recipient.builder().user(user).name("Marcus Sterling").relationship("Strategic Partner").build());
            recipientRepository.save(Recipient.builder().user(user).name("Sophia Chen").relationship("Lead Developer").build());
            recipientRepository.save(Recipient.builder().user(user).name("Alastair Vance").relationship("Founder / Board Member").build());
        }
    }

    private Map<String, Boolean> defaultFeatureFlags() {
        Map<String, Boolean> flags = new HashMap<>();
        flags.put("aiAssistant", false);
        flags.put("budgetPlanner", false);
        flags.put("groupGifting", false);
        flags.put("secretSanta", false);
        flags.put("giftStories", false);
        flags.put("futureLocker", false);
        flags.put("dashboard", false);
        flags.put("recipientVault", false);
        flags.put("occasionCalendar", false);
        return flags;
    }

    private Map<String, Boolean> adminFeatureFlags() {
        Map<String, Boolean> flags = new HashMap<>();
        flags.put("aiAssistant", true);
        flags.put("budgetPlanner", true);
        flags.put("groupGifting", true);
        flags.put("secretSanta", true);
        flags.put("giftStories", true);
        flags.put("futureLocker", true);
        flags.put("dashboard", true);
        flags.put("recipientVault", true);
        flags.put("occasionCalendar", true);
        return flags;
    }
}

package com.giftconcierge.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    private static final Logger log = LoggerFactory.getLogger(TwilioService.class);

    @Value("${twilio.account_sid:dummy_sid}")
    private String accountSid;

    @Value("${twilio.auth_token:dummy_token}")
    private String authToken;

    @Value("${twilio.phone_number:+12345678901}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        try {
            if (!"dummy_sid".equals(accountSid)) {
                Twilio.init(accountSid, authToken);
                log.info("Twilio initialized successfully.");
            }
        } catch (Exception e) {
            log.error("Failed to initialize Twilio: {}", e.getMessage());
        }
    }

    public void sendOtp(String toPhoneNumber, String otpCode) {
        if ("dummy_sid".equals(accountSid)) {
            log.info("MOCK TWILIO - Sending SMS to {}: Your verification code is {}", toPhoneNumber, otpCode);
            return;
        }

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    "Your Corporate Gifting verification code is: " + otpCode
            ).create();
            
            log.info("SMS OTP sent to {} successfully. SID: {}", toPhoneNumber, message.getSid());
        } catch (Exception e) {
            log.error("Failed to send SMS via Twilio to {}: {}", toPhoneNumber, e.getMessage());
            throw new RuntimeException("Failed to send SMS. Please check the phone number and try again.");
        }
    }
}

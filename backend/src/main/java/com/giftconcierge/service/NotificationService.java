package com.giftconcierge.service;

import com.giftconcierge.model.GiftOrder;
import com.giftconcierge.model.User;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone-number:}")
    private String twilioPhoneNumber;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostConstruct
    public void init() {
        if (twilioAccountSid != null && !twilioAccountSid.isBlank() && !twilioAccountSid.contains("placeholder")) {
            try {
                Twilio.init(twilioAccountSid, twilioAuthToken);
                log.info("Twilio initialized successfully.");
            } catch (Exception e) {
                log.error("Failed to initialize Twilio: {}", e.getMessage());
            }
        } else {
            log.warn("Twilio credentials not set. WhatsApp notifications will be simulated.");
        }
    }

    @Async
    public void sendOrderConfirmation(GiftOrder order, User user) {
        sendEmail(order, user);
        sendWhatsApp(order, user);
    }

    private void sendEmail(GiftOrder order, User user) {
        if (fromEmail == null || fromEmail.contains("placeholder") || fromEmail.isBlank()) {
            log.warn("Email sender not configured. Skipping real email sending to {}", user.getEmail());
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Order Confirmation - Louvion Hampers (Order #" + order.getId() + ")");

            String htmlContent = "<h2>Thank you for your order, " + user.getFullName() + "!</h2>"
                    + "<p>Your order <b>#" + order.getId() + "</b> has been confirmed.</p>"
                    + "<p><b>Amount Paid:</b> ₹" + (order.getAmount().add(order.getDeliveryCharge() != null ? order.getDeliveryCharge() : java.math.BigDecimal.ZERO)) + "</p>"
                    + "<p><b>Delivery Address:</b> " + order.getDeliveryAddress() + "</p>"
                    + "<p>We will notify you once your order is dispatched!</p><br>"
                    + "<p>Best Regards,<br>Louvion Hampers Team</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Order confirmation email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private void sendWhatsApp(GiftOrder order, User user) {
        if (twilioAccountSid == null || twilioAccountSid.contains("placeholder")) {
            log.warn("Twilio not configured. Skipping real WhatsApp sending to {}", user.getPhone());
            return;
        }

        if (user.getPhone() == null || user.getPhone().isBlank()) {
            log.warn("User does not have a phone number. Skipping WhatsApp notification.");
            return;
        }

        try {
            String toPhone = user.getPhone();
            if (!toPhone.startsWith("+")) {
                toPhone = "+91" + toPhone; // Assuming India default if no country code
            }

            String messageBody = "Hi " + user.getFullName() + "!\n\n"
                    + "Your order #" + order.getId() + " with Louvion Hampers is confirmed! \n"
                    + "Amount: ₹" + (order.getAmount().add(order.getDeliveryCharge() != null ? order.getDeliveryCharge() : java.math.BigDecimal.ZERO)) + "\n"
                    + "We'll let you know when it ships.";

            Message message = Message.creator(
                    new PhoneNumber("whatsapp:" + toPhone),
                    new PhoneNumber("whatsapp:" + twilioPhoneNumber),
                    messageBody
            ).create();

            log.info("WhatsApp message sent successfully. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}: {}", user.getPhone(), e.getMessage());
        }
    }
}

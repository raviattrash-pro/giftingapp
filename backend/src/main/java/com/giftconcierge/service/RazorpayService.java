package com.giftconcierge.service;

import com.giftconcierge.dto.RazorpayOrderRequest;
import com.giftconcierge.dto.RazorpayOrderResponse;
import com.giftconcierge.dto.RazorpayVerifyRequest;
import com.giftconcierge.exception.BadRequestException;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key.id:placeholder}")
    private String keyId;

    @Value("${razorpay.key.secret:placeholder}")
    private String keySecret;

    public RazorpayOrderResponse createOrder(RazorpayOrderRequest request) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            // Razorpay amount is in paise
            int amountInPaise = request.getAmount().multiply(new BigDecimal("100")).intValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", request.getCurrency() != null ? request.getCurrency() : "INR");
            orderRequest.put("receipt", request.getReceipt());

            Order order = client.orders.create(orderRequest);
            return new RazorpayOrderResponse(
                    order.get("id"),
                    amountInPaise,
                    order.get("currency")
            );
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new BadRequestException("Could not create Razorpay order: " + e.getMessage());
        }
    }

    public boolean verifySignature(RazorpayVerifyRequest request) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (RazorpayException e) {
            log.error("Error verifying Razorpay signature", e);
            return false;
        }
    }
}

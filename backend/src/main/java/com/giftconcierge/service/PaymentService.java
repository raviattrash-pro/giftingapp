package com.giftconcierge.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id:dummy_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:dummy_secret}")
    private String razorpayKeySecret;

    public Map<String, Object> createOrder(int amountInRupees, String receiptId) throws Exception {
        if ("dummy_id".equals(razorpayKeyId)) {
            // Mock response
            Map<String, Object> mockOrder = new HashMap<>();
            mockOrder.put("id", "order_mock_" + System.currentTimeMillis());
            mockOrder.put("amount", amountInRupees * 100);
            mockOrder.put("currency", "INR");
            mockOrder.put("receipt", receiptId);
            return mockOrder;
        }

        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInRupees * 100); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);

        Order order = client.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("receipt", order.get("receipt"));
        return response;
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if ("dummy_id".equals(razorpayKeyId)) {
            return true; // Mock verification success
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(options, razorpayKeySecret);
        } catch (Exception e) {
            return false;
        }
    }
}

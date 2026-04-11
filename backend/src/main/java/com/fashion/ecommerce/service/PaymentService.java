package com.fashion.ecommerce.service;

import com.fashion.ecommerce.exception.BadRequestException;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final String keySecret;

    public PaymentService(
            RazorpayClient razorpayClient,
            @Qualifier("razorpayKeySecret") String keySecret
    ) {
        this.razorpayClient = razorpayClient;
        this.keySecret = keySecret;
    }

    /**
     * Razorpay expects the amount in the smallest currency unit (paise for INR),
     * so we multiply by 100.
     */
    public String createRazorpayOrder(BigDecimal amount, String receipt) {
        try {
            JSONObject options = new JSONObject();
            options.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
            options.put("currency", "INR");
            options.put("receipt", receipt);

            Order rzpOrder = razorpayClient.orders.create(options);
            return rzpOrder.get("id");
        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generated = bytesToHex(hash);
            return generated.equals(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("HMAC verification failed", e);
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}

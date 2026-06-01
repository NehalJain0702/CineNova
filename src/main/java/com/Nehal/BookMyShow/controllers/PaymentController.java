package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.models.Payment;
import com.Nehal.BookMyShow.repositories.PaymentRepository;
import com.razorpay.Order;

import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments") // ⚠️ matches your baseURL

public class PaymentController {

    // ✅ 1. Initiate Payment (POST /payments)
    @Autowired
    private PaymentRepository paymentRepository;
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;
    @PostMapping
    public ResponseEntity<?> initiatePayment(@RequestBody Map<String, Object> request) throws Exception{
        Double amount =
                Double.valueOf(request.get("amount").toString());
        RazorpayClient client =
                new RazorpayClient(keyId, keySecret);
        JSONObject options = new JSONObject();
        options.put("amount", amount.intValue() * 100);
        options.put("currency", "INR");
        Map<String, Object> response = new HashMap<>();

        Order order = client.orders.create(options);
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("status", "INITIATED");
        return ResponseEntity.ok(response);
    }


    // ✅ 2. Verify Payment (POST /payments/verify)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        String razorpayPaymentId =
                request.get("razorpay_payment_id").toString();

        String razorpayOrderId =
                request.get("razorpay_order_id").toString();

        Map<String, Object> response = new HashMap<>();

        if (razorpayPaymentId != null &&
                razorpayOrderId != null) {

            response.put("paymentId", razorpayPaymentId);
            response.put("orderId", razorpayOrderId);
            response.put("status", "SUCCESS");
            response.put("paymentStatus", "COMPLETED");
        } else {

            response.put("status", "FAILED");
            response.put("paymentStatus", "FAILED");
        }

        return ResponseEntity.ok(response);

    }

    // ✅ 3. Get Payment Status (GET /payments/status/{bookingId})
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long bookingId) {
        Payment payment =
                paymentRepository.findByBooking_Id(bookingId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }
}
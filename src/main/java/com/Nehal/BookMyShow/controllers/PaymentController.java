package com.Nehal.BookMyShow.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments") // ⚠️ matches your baseURL
@CrossOrigin(origins = "*")
public class PaymentController {

    // ✅ 1. Initiate Payment (POST /payments)
    @PostMapping
    public ResponseEntity<?> initiatePayment(@RequestBody Map<String, Object> request) {

        Long bookingId = Long.valueOf(request.get("bookingId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        String method = request.get("paymentMethod").toString();

        String paymentId = UUID.randomUUID().toString();

        Map<String, Object> response = new HashMap<>();
        response.put("paymentId", paymentId);
        response.put("bookingId", bookingId);
        response.put("amount", amount);
        response.put("method", method);
        response.put("status", "INITIATED");

        return ResponseEntity.ok(response);
    }

    // ✅ 2. Verify Payment (POST /payments/verify)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {

        Long bookingId = Long.valueOf(request.get("bookingId").toString());
        String paymentId = request.get("paymentId").toString();

        Map<String, Object> response = new HashMap<>();

        if (paymentId != null && !paymentId.isEmpty()) {
            response.put("bookingId", bookingId);
            response.put("paymentId", paymentId);
            response.put("status", "SUCCESS");
            response.put("paymentStatus", "COMPLETED");
        } else {
            response.put("status", "FAILED");
        }

        return ResponseEntity.ok(response);
    }

    // ✅ 3. Get Payment Status (GET /payments/status/{bookingId})
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long bookingId) {

        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", bookingId);
        response.put("status", "SUCCESS");
        response.put("paymentStatus", "COMPLETED");

        return ResponseEntity.ok(response);
    }
}
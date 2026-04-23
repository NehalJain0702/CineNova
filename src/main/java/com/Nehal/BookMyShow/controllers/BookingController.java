package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.Services.BookingService;
import com.Nehal.BookMyShow.models.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✅ 1. Create Booking (MATCHES frontend)
    @PostMapping
    public Map<String, Object> createBooking(@RequestBody Map<String, Object> request) {

        Long showId = Long.valueOf(request.get("showId").toString());
        Long userId = Long.valueOf(request.get("userId").toString());

        List<Integer> seats = (List<Integer>) request.get("seats");

        // Dummy booking creation
        Long bookingId = new Random().nextLong(1000);

        Map<String, Object> response = new HashMap<>();
        response.put("id", bookingId);
        response.put("message", "Booking created");

        return response;
    }

    // ✅ 2. Get Booking Details (VERY IMPORTANT)
    @GetMapping("/{bookingId}")
    public Map<String, Object> getBookingDetails(@PathVariable Long bookingId) {

        Map<String, Object> movie = Map.of("title", "Avengers");
        Map<String, Object> theatre = Map.of("name", "PVR Cinemas");
        Map<String, Object> show = Map.of(
                "showTime", "6:00 PM",
                "showDate", "2026-04-23"
        );

        List<Map<String, Object>> seats = List.of(
                Map.of("row", "A", "seatNumber", 1),
                Map.of("row", "A", "seatNumber", 2)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("movie", movie);
        response.put("theatre", theatre);
        response.put("show", show);
        response.put("seats", seats);
        response.put("totalAmount", 500);
        response.put("convenienceFee", 10);

        return response;
    }

    // ✅ 3. Confirm Booking (MATCHES frontend)
    @PutMapping("/{bookingId}/confirm")
    public Map<String, Object> confirmBooking(@PathVariable Long bookingId) {

        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", bookingId);
        response.put("status", "CONFIRMED");

        return response;
    }
}
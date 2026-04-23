package com.Nehal.BookMyShow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SeatController {

    @GetMapping("/shows/{showId}/seats")
    public List<Map<String, Object>> getSeatsByShow(@PathVariable Long showId) {
        // Minimal shape consumed by frontend:
        // { id, row, seatNumber, status, seatType, price }
        List<Map<String, Object>> seats = new ArrayList<>();

        String[] rows = {"A", "B", "C", "D"};
        long id = showId * 1000;

        for (int r = 0; r < rows.length; r++) {
            for (int n = 1; n <= 10; n++) {
                String seatType = (r <= 1) ? "PREMIUM" : "REGULAR";
                int price = seatType.equals("PREMIUM") ? 300 : 200;
                String status = (n == 3 && r == 0) ? "BOOKED" : "AVAILABLE";

                seats.add(Map.of(
                        "id", id++,
                        "row", rows[r],
                        "seatNumber", n,
                        "status", status,
                        "seatType", seatType,
                        "price", price
                ));
            }
        }

        return seats;
    }
}


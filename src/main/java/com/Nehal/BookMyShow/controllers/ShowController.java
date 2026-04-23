package com.Nehal.BookMyShow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    @GetMapping
    public List<Map<String, Object>> getShows(
            @RequestParam Long movieId,
            @RequestParam Long theatreId
    ) {
        // Minimal shape consumed by frontend:
        // { id, showTime, format?, price? }
        // Accepts `movieId` and `theatreId` to match frontend query params.
        return List.of(
                Map.of(
                        "id", 101,
                        "showTime", "10:30 AM",
                        "format", "2D",
                        "price", 180
                ),
                Map.of(
                        "id", 102,
                        "showTime", "02:15 PM",
                        "format", "3D",
                        "price", 250
                ),
                Map.of(
                        "id", 103,
                        "showTime", "06:00 PM",
                        "format", "IMAX",
                        "price", 380
                )
        );
    }

    @GetMapping("/{showId}")
    public Map<String, Object> getShowById(@PathVariable Long showId) {
        return Map.of(
                "id", showId,
                "showTime", "06:00 PM",
                "format", "2D",
                "price", 220
        );
    }
}


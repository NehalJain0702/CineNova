package com.Nehal.BookMyShow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    @GetMapping
    public List<Map<String, Object>> getTheatres(@RequestParam(required = false) Long movieId) {
        // Minimal shape consumed by frontend:
        // { id, name, location, distance? }
        // Optional `movieId` param is accepted to match frontend calls.
        return List.of(
                Map.of(
                        "id", 1,
                        "name", "PVR Cinemas",
                        "location", "Phoenix Mall",
                        "distance", 2.4
                ),
                Map.of(
                        "id", 2,
                        "name", "INOX",
                        "location", "City Center",
                        "distance", 5.1
                )
        );
    }
}



package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.Services.UserService;
import com.Nehal.BookMyShow.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")

public class authController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            User user = userService.login(email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("token", UUID.randomUUID().toString());

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getEmail());
            userData.put("email", user.getEmail());

            response.put("user", userData);

            return ResponseEntity.ok(response); // 200 ✅

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage()); // send error message to frontend
            return ResponseEntity.status(401).body(error); // 401 instead of 500
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            User user = userService.signup(email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("token", UUID.randomUUID().toString());

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", name);
            userData.put("email", email);

            response.put("user", userData);

            return ResponseEntity.ok(response); // 200 ✅

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }
}
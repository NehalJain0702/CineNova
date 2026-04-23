
package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.Services.UserService;
import com.Nehal.BookMyShow.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class authController {

    @Autowired
    private UserService userService;

    // ✅ SIGNUP
    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> request) {

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

        return response;
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        User user = userService.login(email, password); // you need to implement this

        Map<String, Object> response = new HashMap<>();
        response.put("token", UUID.randomUUID().toString());

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getEmail());
        userData.put("email", user.getEmail());

        response.put("user", userData);

        return response;
    }
}

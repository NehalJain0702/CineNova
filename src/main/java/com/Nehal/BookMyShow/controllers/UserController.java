package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.DTOs.ResponseStatus;
import com.Nehal.BookMyShow.DTOs.SignUpRequestDTO;
import com.Nehal.BookMyShow.DTOs.SignUpResponseDTO;
import com.Nehal.BookMyShow.Services.UserService;
import com.Nehal.BookMyShow.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/signup")
    public SignUpResponseDTO signUp(@RequestBody SignUpRequestDTO signUpRequestDTO){
        SignUpResponseDTO signUpResponseDTO = new SignUpResponseDTO();
        try {
            User user = userService.signup(signUpRequestDTO.getEmail(), signUpRequestDTO.getPassword());
            signUpResponseDTO.setId(user.getId());
            signUpResponseDTO.setMessage("User is successfully signed up");
            signUpResponseDTO.setResponseStatus(ResponseStatus.SUCCESS);

        }catch (Exception e){
            System.out.println("Error in signup"+e.getMessage());
            signUpResponseDTO.setMessage(e.getMessage());
            signUpResponseDTO.setResponseStatus(ResponseStatus.FAILURE);

        }
        return signUpResponseDTO;
    }
}

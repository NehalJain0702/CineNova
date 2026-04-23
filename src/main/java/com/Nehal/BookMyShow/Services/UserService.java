package com.Nehal.BookMyShow.Services;

import com.Nehal.BookMyShow.models.User;
import com.Nehal.BookMyShow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public User signup(String email,String password){
        Optional<User> optionalUser=userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            throw new RuntimeException("User with email is already Present");
        }
        User user=new User();
        user.setName("Akash");
        user.setEmail(email);
        BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
        user.setPassword(bCryptPasswordEncoder.encode(password));

        return userRepository.save(user);
    }
    public User login(String email,String password){
        Optional<User> optionalUser=userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new RuntimeException("User not found");
        }
        User user=optionalUser.get();
        BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
        if(!bCryptPasswordEncoder.matches(password,user.getPassword())){
            throw new RuntimeException("Invalid Password");
        }
        return user;
    }
}

package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;

import java.util.List;

@Entity(name="bms_user")
public class User extends BaseModel{
    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String phoneNumber;

    // Relationships

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
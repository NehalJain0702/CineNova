package com.Nehal.BookMyShow.models;

import lombok.Getter;
import lombok.Setter;


public enum BookingStatus {
    PENDING("Waiting for payment"),
    CONFIRMED("Booking Succesfull"),
    CANCELLED("Booking cancelled"),
    FAILED("Booking failed");
    private final String message;
    BookingStatus(String message) {
        this.message=message;
    }


    public String getMessage() {
        return message;
    }
}

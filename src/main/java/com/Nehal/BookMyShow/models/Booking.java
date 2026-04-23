package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;

import java.util.List;
@Entity
public class Booking extends BaseModel{

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Payment> payments;
    private double amount;
    @ManyToOne
    private User user;
    @ManyToOne
    private Shows show;
    @OneToMany
    private List<ShowSeat> showSeats;
    @Enumerated
    private BookingStatus bookingStatus;
    public Booking() {

    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    public Shows getShow() {
        return show;
    }

    public void setShow(Shows show) {
        this.show = show;
    }

    public List<ShowSeat> getShowSeats() {
        return showSeats;
    }

    public void setShowSeats(List<ShowSeat> showSeats) {
        this.showSeats = showSeats;
    }
@Enumerated(EnumType.STRING)
    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}

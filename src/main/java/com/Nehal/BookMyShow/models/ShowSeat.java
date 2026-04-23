package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor

@Entity
public class ShowSeat extends BaseModel{
    @ManyToOne
    private Shows show;

    @ManyToOne
    private Seat seat;

    @Enumerated(EnumType.STRING)
    private ShowSeatStatus status;

    private double price;
    private Date blockedAt;
    public Shows getShow() {
        return show;
    }

    public void setShow(Shows show) {
        this.show = show;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getBlockedAt() {
        return blockedAt;
    }

    public void setBlockedAt(Date blockedAt) {
        this.blockedAt = blockedAt;
    }

    public ShowSeatStatus getStatus() {
        return status;
    }

    public void setStatus(ShowSeatStatus status) {
        this.status = status;
    }

    // Constructors

    // Getters & Setters
}
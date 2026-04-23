package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;

import lombok.*;
import java.time.LocalDateTime;
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Entity
public class Payment extends BaseModel{
    private double amount;

    private LocalDateTime paymentTime;

    @Enumerated(EnumType.ORDINAL)
    private PaymentStatus status;

    private String transactionId;
    @ManyToOne
    private Booking booking;
    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    // Constructors


}

package com.Nehal.BookMyShow.models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ShowSeatType extends BaseModel{
    @ManyToOne
    private Shows show;
    @Enumerated(EnumType.STRING)
    private SeatType seatType;

    private int price;

    public ShowSeatType(SeatType seatType) {
        this.seatType = seatType;
    }

    public Shows getShow() {
        return show;
    }

    public void setShow(Shows show) {
        this.show = show;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

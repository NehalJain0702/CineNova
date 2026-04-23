package com.Nehal.BookMyShow.DTOs;

import java.util.List;

public class BookingRequestDTO {
    private Integer userId;
    private Long showId;
    private List<Long> showSeatId;


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public List<Long> getShowSeatId() {
        return showSeatId;
    }

    public void setShowSeatId(List<Long> showSeatId) {
        this.showSeatId = showSeatId;
    }
}


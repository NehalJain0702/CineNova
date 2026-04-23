package com.Nehal.BookMyShow.Services;

import com.Nehal.BookMyShow.models.*;
import com.Nehal.BookMyShow.repositories.BookingRepository;
import com.Nehal.BookMyShow.repositories.ShowRepository;
import com.Nehal.BookMyShow.repositories.ShowSeatRepository;
import com.Nehal.BookMyShow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Optional;
@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ShowRepository showRepository;
    @Autowired
    private ShowSeatRepository showSeatRepository;
    @Autowired
    private UserRepository userRepository;
    public Booking baseTickets(List<Long> showSeatIds,Long showId,Integer userId){
        Optional<User> optionalUser=userRepository.findById(userId);
        Optional<Shows> optionalShow=showRepository.findById(showId);
        if(optionalShow.isEmpty()){
            throw new RuntimeException("Show does't exist");
        }
        List<ShowSeat> showSeats=reserveSeat(showSeatIds,showId);
        int amount=1000;
        Booking booking=new Booking();
        booking.setUser(optionalUser.get());
        booking.setShow(optionalShow.get());
        booking.setShowSeats(showSeats);
        booking.setAmount(amount);
        booking.setBookingStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public List<ShowSeat> reserveSeat(List<Long> showSeatIds,Long showId){
    for(Long showSeatId:showSeatIds){
        checkAvailability(showSeatId);
    }
    List<ShowSeat> showSeats=showSeatRepository.findAllById(showSeatIds);
    for(ShowSeat showSeat:showSeats){
        if(showSeat.getShow().getId().equals(showId)) {
            showSeat.setStatus(ShowSeatStatus.BLOCKED);
            showSeat.setBlockedAt(new Date());
        }
    }
   return showSeatRepository.saveAll(showSeats);
}
public double calculateTotalAmount(List<ShowSeat> showSeats) {
        double total = 0;
        for (ShowSeat seat : showSeats) {
            total += seat.getPrice();
        }
        return total;
    }
public void checkAvailability(Long showSeadId){
        Optional<ShowSeat>showSeatOptional=showSeatRepository.findById(showSeadId);
        if(showSeatOptional.isEmpty()){
            throw new RuntimeException("Invalid show seat selected");
        }
        ShowSeat showSeat=showSeatOptional.get();
        if(showSeat.getStatus().equals(ShowSeatStatus.BOOKED)){
            throw new RuntimeException("Seats are already boked");
        }
        if(showSeat.getStatus().equals(ShowSeatStatus.BLOCKED)){

            Long duration= Duration.between(new Date().toInstant(),showSeat.getBlockedAt().toInstant()).toMinutes();
            if(duration<10){
                throw new RuntimeException("Seats are currently blocked");
            }

        }
    }
    public Booking confirmBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // mark seats as BOOKED
        for (ShowSeat seat : booking.getShowSeats()) {
            seat.setStatus(ShowSeatStatus.BOOKED);
        }

        booking.setBookingStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        for (ShowSeat seat : booking.getShowSeats()) {
            seat.setStatus(ShowSeatStatus.AVAILABLE);
            seat.setBlockedAt(null);
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);

        bookingRepository.save(booking);
    }

}

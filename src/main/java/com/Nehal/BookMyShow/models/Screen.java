package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@Entity
public class Screen extends BaseModel{
    private String name; // Screen 1, Screen 2

    private int totalSeats;

    @ElementCollection
    @Enumerated(EnumType.ORDINAL)
    private List<Features> features;

    // Relationships

    @ManyToOne
    private Theatre theatre;

    @OneToMany(mappedBy = "screen")
    private List<Shows> shows;

    @OneToMany(mappedBy = "screen")
    private List<Seat> seats;

    // Constructors


}

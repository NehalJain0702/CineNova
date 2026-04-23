package com.Nehal.BookMyShow.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
public class Theatre extends BaseModel{
    private String name;
    private String address;
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Regions region;
}

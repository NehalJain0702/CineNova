package com.Nehal.BookMyShow.models;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Regions extends BaseModel{
    private String name;
    private String city;
    @OneToMany(mappedBy = "region")
    private List<Theatre> theatres;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}

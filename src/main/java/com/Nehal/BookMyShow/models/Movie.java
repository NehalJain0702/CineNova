package com.Nehal.BookMyShow.models;

import jakarta.persistence.*;

import java.util.List;


@Entity
public class Movie extends BaseModel {
    public Movie(String title,
                 List<Language> languages,
                 int duration,
                 String genre,
                 String description,
                 List<String> actors,
                 double rating) {

        this.title = title;
        this.languages = languages;
        this.duration = duration;
        this.genre = genre;
        this.description = description;
        this.actors = actors;
        this.rating = rating;
    }
    public Movie() {
    }
    private String title;
    private String status;
    @Enumerated(EnumType.STRING)
    @ElementCollection
    private List<Language> languages;
    private String posterURL;
    private int duration;

    private String genre;

    private String description;

    @ElementCollection
    private List<String> actors;

    private double rating;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(List<Language> languages) {
        this.languages = languages;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<String> getActors() {
        return actors;
    }

    public void setActors(List<String> actors) {
        this.actors = actors;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPosterURL() {
        return posterURL;
    }

    public void setPosterURL(String posterURL) {
        this.posterURL = posterURL;
    }
}
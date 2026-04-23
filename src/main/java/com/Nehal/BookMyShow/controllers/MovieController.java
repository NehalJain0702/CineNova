package com.Nehal.BookMyShow.controllers;


import com.Nehal.BookMyShow.models.Movie;
import com.Nehal.BookMyShow.models.Language;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private List<Movie> getDummyMovies() {
        List<Movie> movies = new ArrayList<>();

        Movie m1 = new Movie(
                "Avengers",
                List.of(Language.English),
                180,
                "Action",
                "Superhero movie",
                List.of("Robert Downey Jr."),
                4.5
        );
        m1.setId(1);

        Movie m2 = new Movie(
                "Pushpa",
                List.of(Language.Hindi),
                170,
                "Action",
                "Allu Arjun blockbuster",
                List.of("Allu Arjun"),
                4.2
        );
        m2.setId(2);
        movies.add(m1);
        movies.add(m2);


        return movies;
    }

    @GetMapping
    public List<Movie> getMovies() {
        return getDummyMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable int id) {
        return getDummyMovies().stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }
}
package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.models.Movie;
import com.Nehal.BookMyShow.models.Language;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Movie Controller - REST endpoints for movie operations
 * 
 * Base URL: /api/movies
 * 
 * Endpoints:
 * - GET /api/movies          → Get all movies
 * - GET /api/movies/{id}     → Get movie by ID
 * - GET /api/movies/search   → Search movies
 */
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    /**
     * Get all movies
     * @return List of all movies
     */
    @GetMapping
    public ResponseEntity<List<Movie>> getMovies() {
        List<Movie> movies = getDummyMovies();
        System.out.println("✅ GET /api/movies - Returning " + movies.size() + " movies");
        return ResponseEntity.ok(movies);
    }

    /**
     * Get a single movie by ID
     * 
     * ⚠️ CRITICAL: Frontend sends numeric ID in path param
     * Spring Boot converts it to int via @PathVariable
     * 
     * @param id Movie ID (must be a valid integer)
     * @return Movie object if found
     * @throws ResponseStatusException 404 if movie not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable int id) {
        System.out.println("🔍 GET /api/movies/" + id);
        
        // ✅ Validate ID
        if (id <= 0) {
            System.err.println("❌ Invalid movie ID: " + id);
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Movie ID must be a positive integer, received: " + id
            );
        }

        // ✅ Find movie
        Movie movie = getDummyMovies().stream()
                .filter(m -> m.getId() == id)
                .findFirst()
                .orElse(null);

        // ✅ Return 404 if not found
        if (movie == null) {
            System.err.println("❌ Movie not found with ID: " + id);
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Movie with ID " + id + " not found"
            );
        }

        System.out.println("✅ Returning movie: " + movie.getTitle());
        return ResponseEntity.ok(movie);
    }

    /**
     * Search movies by query
     * 
     * @param q Search query (title, genre, etc.)
     * @return List of matching movies
     */
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String q) {
        System.out.println("🔍 Searching movies with query: " + q);
        
        if (q == null || q.trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Search query cannot be empty"
            );
        }

        String searchTerm = q.toLowerCase().trim();
        List<Movie> results = getDummyMovies().stream()
                .filter(m -> m.getTitle().toLowerCase().contains(searchTerm) ||
                           m.getGenre().toLowerCase().contains(searchTerm))
                .toList();

        System.out.println("✅ Found " + results.size() + " matching movies");
        return ResponseEntity.ok(results);
    }

    /**
     * Get upcoming movies
     * @return List of upcoming movies
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<Movie>> getUpcomingMovies() {
        System.out.println("✅ GET /api/movies/upcoming");
        List<Movie> upcomingMovies = getDummyMovies().stream()
                .filter(m -> "Upcoming".equals(m.getStatus()))
                .toList();
        return ResponseEntity.ok(upcomingMovies);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Generate dummy movie data for testing
     * In production, this would come from a database
     */
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
        m1.setStatus("Now Showing");
        m1.setMovieURL("https://i.pinimg.com/736x/21/d6/21/21d62106e83e8bddfa41024dfc195356.jpg");
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
        m2.setStatus("Now Showing");
        m2.setMovieURL("https://i.pinimg.com/736x/54/6c/6c/546c6c9c1a2c6d4d0d1b7f1b3d6b7d2d.jpg");
        movies.add(m1);
        movies.add(m2);

        return movies;
    }
}
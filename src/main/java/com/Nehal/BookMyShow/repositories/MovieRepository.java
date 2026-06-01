package com.Nehal.BookMyShow.repositories;

import com.Nehal.BookMyShow.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie,Integer> {

}

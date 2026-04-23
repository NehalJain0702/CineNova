package com.Nehal.BookMyShow.repositories;

import com.Nehal.BookMyShow.models.Shows;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowRepository extends JpaRepository<Shows,Long>{

}

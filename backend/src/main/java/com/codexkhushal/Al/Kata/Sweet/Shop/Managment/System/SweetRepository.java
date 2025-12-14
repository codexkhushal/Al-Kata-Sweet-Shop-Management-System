package com.codexkhushal.Al.Kata.Sweet.Shop.Managment.System;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; 

public interface SweetRepository extends JpaRepository<Sweet, Long> {
    
    List<Sweet> findByCategory(String category);
}
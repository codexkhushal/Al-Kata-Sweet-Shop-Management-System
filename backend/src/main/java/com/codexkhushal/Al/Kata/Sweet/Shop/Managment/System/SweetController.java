package com.codexkhushal.Al.Kata.Sweet.Shop.Managment.System;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetRepository sweetRepository;

    public SweetController(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    @PostMapping
    public ResponseEntity<Sweet> createSweet(@Valid @RequestBody SweetRequest request) {
        Sweet sweet = new Sweet(request.name(), request.category(), request.price(), request.quantity(), request.imageUrl());
        Sweet savedSweet = sweetRepository.save(sweet);
        return new ResponseEntity<>(savedSweet, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return new ResponseEntity<>(sweetRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sweet> getSweetById(@PathVariable Long id) {
        Optional<Sweet> sweet = sweetRepository.findById(id);
        return sweet.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sweet> updateSweet(@PathVariable Long id, @Valid @RequestBody SweetRequest request) {
        Optional<Sweet> sweetOptional = sweetRepository.findById(id);

        if (sweetOptional.isPresent()) {
            Sweet sweet = sweetOptional.get();
            sweet.setName(request.name());
            sweet.setCategory(request.category());
            sweet.setPrice(request.price());
            sweet.setQuantity(request.quantity());
            sweet.setImageUrl(request.imageUrl()); 
            return new ResponseEntity<>(sweetRepository.save(sweet), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
        if (sweetRepository.existsById(id)) {
            sweetRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Sweet>> getSweetsByCategory(@PathVariable String category) {
        List<Sweet> sweets = sweetRepository.findByCategory(category);
        return new ResponseEntity<>(sweets, HttpStatus.OK);
    }

    public record SweetRequest(
        @NotBlank(message = "Name is required") 
        String name, 
        
        String category, 
        
        @Positive(message = "Price must be greater than zero") 
        Double price, 
        
        Integer quantity,

        String imageUrl 
    ) {}
}
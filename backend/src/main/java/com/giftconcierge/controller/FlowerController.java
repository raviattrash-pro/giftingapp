package com.giftconcierge.controller;

import com.giftconcierge.model.Flower;
import com.giftconcierge.repository.FlowerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flowers")
public class FlowerController {

    private final FlowerRepository flowerRepository;

    public FlowerController(FlowerRepository flowerRepository) {
        this.flowerRepository = flowerRepository;
    }

    @GetMapping
    public ResponseEntity<List<Flower>> getAllFlowers(@RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(flowerRepository.findByIsEnabledTrue());
        }
        return ResponseEntity.ok(flowerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Flower> createFlower(@RequestBody Flower flower) {
        return ResponseEntity.ok(flowerRepository.save(flower));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flower> updateFlower(@PathVariable Long id, @RequestBody Flower flowerDetails) {
        return flowerRepository.findById(id).map(flower -> {
            flower.setName(flowerDetails.getName());
            flower.setImageUrl(flowerDetails.getImageUrl());
            flower.setIsEnabled(flowerDetails.getIsEnabled());
            return ResponseEntity.ok(flowerRepository.save(flower));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlower(@PathVariable Long id) {
        if (flowerRepository.existsById(id)) {
            flowerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

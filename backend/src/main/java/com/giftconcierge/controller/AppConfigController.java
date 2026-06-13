package com.giftconcierge.controller;

import com.giftconcierge.model.AppConfig;
import com.giftconcierge.repository.AppConfigRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class AppConfigController {

    private final AppConfigRepository appConfigRepository;

    public AppConfigController(AppConfigRepository appConfigRepository) {
        this.appConfigRepository = appConfigRepository;
    }

    @GetMapping("/{key}")
    public ResponseEntity<Map<String, String>> getConfig(@PathVariable String key) {
        return appConfigRepository.findByConfigKey(key)
                .map(config -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("value", config.getConfigValue());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

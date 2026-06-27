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
                .orElseGet(() -> {
                    Map<String, String> emptyResponse = new HashMap<>();
                    emptyResponse.put("value", "");
                    return ResponseEntity.ok(emptyResponse);
                });
    }

    @PostMapping("/{key}")
    public ResponseEntity<Map<String, String>> saveConfig(@PathVariable String key, @RequestBody Map<String, String> request) {
        String value = request.get("value");
        AppConfig config = appConfigRepository.findByConfigKey(key).orElse(new AppConfig(key, ""));
        config.setConfigValue(value);
        appConfigRepository.save(config);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Config saved successfully");
        response.put("key", key);
        return ResponseEntity.ok(response);
    }
}

package com.giftconcierge.controller;

import com.giftconcierge.model.SiteContent;
import com.giftconcierge.repository.SiteContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class SiteContentController {

    private final SiteContentRepository siteContentRepository;

    public SiteContentController(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    @GetMapping("/api/content")
    public ResponseEntity<Map<String, String>> getAllContent() {
        List<SiteContent> contentList = siteContentRepository.findAll();
        Map<String, String> contentMap = contentList.stream()
                .collect(Collectors.toMap(SiteContent::getSectionKey, SiteContent::getContent));
        return ResponseEntity.ok(contentMap);
    }

    @PostMapping("/api/admin/content")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateContent(@RequestBody Map<String, String> payload) {
        payload.forEach((key, value) -> {
            SiteContent content = siteContentRepository.findById(key).orElse(new SiteContent(key, ""));
            content.setContent(value);
            siteContentRepository.save(content);
        });
        return ResponseEntity.ok(Map.of("success", true, "message", "Content updated successfully"));
    }
}

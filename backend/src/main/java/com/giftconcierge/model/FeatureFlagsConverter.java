package com.giftconcierge.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Map;
import java.util.HashMap;

@Converter
public class FeatureFlagsConverter implements AttributeConverter<Map<String, Boolean>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Boolean> attribute) {
        if (attribute == null) return null;
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            return "{}";
        }
    }

    @Override
    public Map<String, Boolean> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            Map<String, Boolean> defaultMap = new HashMap<>();
            defaultMap.put("aiAssistant", true);
            defaultMap.put("budgetPlanner", true);
            defaultMap.put("groupGifting", true);
            defaultMap.put("secretSanta", true);
            defaultMap.put("giftStories", true);
            defaultMap.put("futureLocker", true);
            return defaultMap;
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<HashMap<String, Boolean>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}

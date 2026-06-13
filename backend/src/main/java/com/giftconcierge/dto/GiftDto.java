package com.giftconcierge.dto;

import java.math.BigDecimal;

public class GiftDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;

    public GiftDto() {
    }

    public GiftDto(Long id, String name, String description, BigDecimal price, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiftDto giftDto = (GiftDto) o;
        return java.util.Objects.equals(id, giftDto.id) &&
                java.util.Objects.equals(name, giftDto.name) &&
                java.util.Objects.equals(description, giftDto.description) &&
                java.util.Objects.equals(price, giftDto.price) &&
                java.util.Objects.equals(category, giftDto.category);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, description, price, category);
    }

    @Override
    public String toString() {
        return "GiftDto(id=" + id + ", name=" + name + ", description=" + description + ", price=" + price + ", category=" + category + ")";
    }

    public static GiftDtoBuilder builder() {
        return new GiftDtoBuilder();
    }

    public static class GiftDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String category;

        GiftDtoBuilder() {
        }

        public GiftDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public GiftDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GiftDtoBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public GiftDtoBuilder category(String category) {
            this.category = category;
            return this;
        }

        public GiftDto build() {
            return new GiftDto(id, name, description, price, category);
        }
    }
}

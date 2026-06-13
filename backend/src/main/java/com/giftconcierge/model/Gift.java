package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "gifts")
public class Gift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String subcategory;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "gift_additional_images", joinColumns = @JoinColumn(name = "gift_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private java.util.List<String> additionalImages = new java.util.ArrayList<>();

    @Column(name = "emotion_tags", columnDefinition = "TEXT")
    private String emotionTags;

    @Column(name = "is_digital")
    private Boolean isDigital = false;

    @Column(name = "is_experience")
    private Boolean isExperience = false;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private Integer stock = 20;

    @Column(name = "luxury_tax", precision = 10, scale = 2, nullable = false)
    private BigDecimal luxuryTax = BigDecimal.valueOf(8.00);

    @Column(name = "courier_handling", precision = 10, scale = 2, nullable = false)
    private BigDecimal courierHandling = BigDecimal.valueOf(50.00);

    @Transient
    public String getAvailability() {
        if (stock == null || stock <= 0) {
            return "Out of Stock";
        } else if (stock <= 5) {
            return "Low Stock";
        } else {
            return "In Stock";
        }
    }

    public Gift() {
    }

    public Gift(Long id, String name, String description, String category, String subcategory, BigDecimal price, String imageUrl, String emotionTags, Boolean isDigital, Boolean isExperience, BigDecimal rating, Integer reviewCount, Integer stock, BigDecimal luxuryTax, BigDecimal courierHandling) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.subcategory = subcategory;
        this.price = price;
        this.imageUrl = imageUrl;
        this.emotionTags = emotionTags;
        this.isDigital = isDigital;
        this.isExperience = isExperience;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.stock = stock;
        this.luxuryTax = luxuryTax != null ? luxuryTax : BigDecimal.valueOf(8.00);
        this.courierHandling = courierHandling != null ? courierHandling : BigDecimal.valueOf(50.00);
        this.additionalImages = new java.util.ArrayList<>();
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

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubcategory() {
        return this.subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public java.util.List<String> getAdditionalImages() {
        return additionalImages;
    }

    public void setAdditionalImages(java.util.List<String> additionalImages) {
        this.additionalImages = additionalImages;
    }

    public String getEmotionTags() {
        return this.emotionTags;
    }

    public void setEmotionTags(String emotionTags) {
        this.emotionTags = emotionTags;
    }

    public Boolean getIsDigital() {
        return this.isDigital;
    }

    public void setIsDigital(Boolean isDigital) {
        this.isDigital = isDigital;
    }

    public Boolean getIsExperience() {
        return this.isExperience;
    }

    public void setIsExperience(Boolean isExperience) {
        this.isExperience = isExperience;
    }

    public BigDecimal getRating() {
        return this.rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return this.reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getStock() {
        return this.stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public BigDecimal getLuxuryTax() {
        return this.luxuryTax;
    }

    public void setLuxuryTax(BigDecimal luxuryTax) {
        this.luxuryTax = luxuryTax;
    }

    public BigDecimal getCourierHandling() {
        return this.courierHandling;
    }

    public void setCourierHandling(BigDecimal courierHandling) {
        this.courierHandling = courierHandling;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Gift gift = (Gift) o;
        return java.util.Objects.equals(id, gift.id) &&
                java.util.Objects.equals(name, gift.name) &&
                java.util.Objects.equals(description, gift.description) &&
                java.util.Objects.equals(category, gift.category) &&
                java.util.Objects.equals(subcategory, gift.subcategory) &&
                java.util.Objects.equals(price, gift.price) &&
                java.util.Objects.equals(imageUrl, gift.imageUrl) &&
                java.util.Objects.equals(emotionTags, gift.emotionTags) &&
                java.util.Objects.equals(isDigital, gift.isDigital) &&
                java.util.Objects.equals(isExperience, gift.isExperience) &&
                java.util.Objects.equals(rating, gift.rating) &&
                java.util.Objects.equals(reviewCount, gift.reviewCount) &&
                java.util.Objects.equals(stock, gift.stock);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, description, category, subcategory, price, imageUrl, emotionTags, isDigital, isExperience, rating, reviewCount, stock);
    }

    @Override
    public String toString() {
        return "Gift(id=" + id + ", name=" + name + ", description=" + description + ", category=" + category + ", subcategory=" + subcategory + ", price=" + price + ", imageUrl=" + imageUrl + ", emotionTags=" + emotionTags + ", isDigital=" + isDigital + ", isExperience=" + isExperience + ", rating=" + rating + ", reviewCount=" + reviewCount + ", stock=" + stock + ")";
    }

    public static GiftBuilder builder() {
        return new GiftBuilder();
    }

    public static class GiftBuilder {
        private Long id;
        private String name;
        private String description;
        private String category;
        private String subcategory;
        private BigDecimal price;
        private String imageUrl;
        private String emotionTags;
        private Boolean isDigital = false;
        private Boolean isExperience = false;
        private BigDecimal rating = BigDecimal.ZERO;
        private Integer reviewCount = 0;
        private Integer stock = 20;
        private BigDecimal luxuryTax = BigDecimal.valueOf(8.00);
        private BigDecimal courierHandling = BigDecimal.valueOf(50.00);

        GiftBuilder() {
        }

        public GiftBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GiftBuilder name(String name) {
            this.name = name;
            return this;
        }

        public GiftBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GiftBuilder category(String category) {
            this.category = category;
            return this;
        }

        public GiftBuilder subcategory(String subcategory) {
            this.subcategory = subcategory;
            return this;
        }

        public GiftBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public GiftBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public GiftBuilder emotionTags(String emotionTags) {
            this.emotionTags = emotionTags;
            return this;
        }

        public GiftBuilder isDigital(Boolean isDigital) {
            this.isDigital = isDigital;
            return this;
        }

        public GiftBuilder isExperience(Boolean isExperience) {
            this.isExperience = isExperience;
            return this;
        }

        public GiftBuilder rating(BigDecimal rating) {
            this.rating = rating;
            return this;
        }

        public GiftBuilder reviewCount(Integer reviewCount) {
            this.reviewCount = reviewCount;
            return this;
        }

        public GiftBuilder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public GiftBuilder luxuryTax(BigDecimal luxuryTax) {
            this.luxuryTax = luxuryTax;
            return this;
        }

        public GiftBuilder courierHandling(BigDecimal courierHandling) {
            this.courierHandling = courierHandling;
            return this;
        }

        public Gift build() {
            return new Gift(id, name, description, category, subcategory, price, imageUrl, emotionTags, isDigital, isExperience, rating, reviewCount, stock, luxuryTax, courierHandling);
        }
    }
}

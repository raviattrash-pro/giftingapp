package com.giftconcierge.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "wishlist_items")
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String url;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_purchased")
    private Boolean isPurchased = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchased_by")
    private User purchasedBy;

    public WishlistItem() {
    }

    public WishlistItem(Long id, Wishlist wishlist, String name, String description, String url, BigDecimal price, String imageUrl, Boolean isPurchased, User purchasedBy) {
        this.id = id;
        this.wishlist = wishlist;
        this.name = name;
        this.description = description;
        this.url = url;
        this.price = price;
        this.imageUrl = imageUrl;
        this.isPurchased = isPurchased;
        this.purchasedBy = purchasedBy;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Wishlist getWishlist() {
        return this.wishlist;
    }

    public void setWishlist(Wishlist wishlist) {
        this.wishlist = wishlist;
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

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public Boolean getIsPurchased() {
        return this.isPurchased;
    }

    public void setIsPurchased(Boolean isPurchased) {
        this.isPurchased = isPurchased;
    }

    public User getPurchasedBy() {
        return this.purchasedBy;
    }

    public void setPurchasedBy(User purchasedBy) {
        this.purchasedBy = purchasedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishlistItem that = (WishlistItem) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(description, that.description) &&
                java.util.Objects.equals(url, that.url) &&
                java.util.Objects.equals(price, that.price) &&
                java.util.Objects.equals(imageUrl, that.imageUrl) &&
                java.util.Objects.equals(isPurchased, that.isPurchased);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, description, url, price, imageUrl, isPurchased);
    }

    @Override
    public String toString() {
        return "WishlistItem(id=" + id + ", name=" + name + ", description=" + description + ", url=" + url + ", price=" + price + ", imageUrl=" + imageUrl + ", isPurchased=" + isPurchased + ")";
    }

    public static WishlistItemBuilder builder() {
        return new WishlistItemBuilder();
    }

    public static class WishlistItemBuilder {
        private Long id;
        private Wishlist wishlist;
        private String name;
        private String description;
        private String url;
        private BigDecimal price;
        private String imageUrl;
        private Boolean isPurchased = false;
        private User purchasedBy;

        WishlistItemBuilder() {
        }

        public WishlistItemBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WishlistItemBuilder wishlist(Wishlist wishlist) {
            this.wishlist = wishlist;
            return this;
        }

        public WishlistItemBuilder name(String name) {
            this.name = name;
            return this;
        }

        public WishlistItemBuilder description(String description) {
            this.description = description;
            return this;
        }

        public WishlistItemBuilder url(String url) {
            this.url = url;
            return this;
        }

        public WishlistItemBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public WishlistItemBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public WishlistItemBuilder isPurchased(Boolean isPurchased) {
            this.isPurchased = isPurchased;
            return this;
        }

        public WishlistItemBuilder purchasedBy(User purchasedBy) {
            this.purchasedBy = purchasedBy;
            return this;
        }

        public WishlistItem build() {
            return new WishlistItem(id, wishlist, name, description, url, price, imageUrl, isPurchased, purchasedBy);
        }
    }
}

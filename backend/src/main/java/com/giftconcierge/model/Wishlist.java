package com.giftconcierge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wishlists")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 30)
    private String type;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(name = "share_code", unique = true, length = 50)
    private String shareCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WishlistItem> items = new ArrayList<>();

    public Wishlist() {
    }

    public Wishlist(Long id, User user, String name, String type, Boolean isPublic, String shareCode, LocalDateTime createdAt, List<WishlistItem> items) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.type = type;
        this.isPublic = isPublic;
        this.shareCode = shareCode;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getIsPublic() {
        return this.isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getShareCode() {
        return this.shareCode;
    }

    public void setShareCode(String shareCode) {
        this.shareCode = shareCode;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<WishlistItem> getItems() {
        return this.items;
    }

    public void setItems(List<WishlistItem> items) {
        this.items = items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Wishlist wishlist = (Wishlist) o;
        return java.util.Objects.equals(id, wishlist.id) &&
                java.util.Objects.equals(name, wishlist.name) &&
                java.util.Objects.equals(type, wishlist.type) &&
                java.util.Objects.equals(isPublic, wishlist.isPublic) &&
                java.util.Objects.equals(shareCode, wishlist.shareCode) &&
                java.util.Objects.equals(createdAt, wishlist.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, type, isPublic, shareCode, createdAt);
    }

    @Override
    public String toString() {
        return "Wishlist(id=" + id + ", name=" + name + ", type=" + type + ", isPublic=" + isPublic + ", shareCode=" + shareCode + ", createdAt=" + createdAt + ")";
    }

    public static WishlistBuilder builder() {
        return new WishlistBuilder();
    }

    public static class WishlistBuilder {
        private Long id;
        private User user;
        private String name;
        private String type;
        private Boolean isPublic = false;
        private String shareCode;
        private LocalDateTime createdAt;
        private List<WishlistItem> items = new ArrayList<>();

        WishlistBuilder() {
        }

        public WishlistBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WishlistBuilder user(User user) {
            this.user = user;
            return this;
        }

        public WishlistBuilder name(String name) {
            this.name = name;
            return this;
        }

        public WishlistBuilder type(String type) {
            this.type = type;
            return this;
        }

        public WishlistBuilder isPublic(Boolean isPublic) {
            this.isPublic = isPublic;
            return this;
        }

        public WishlistBuilder shareCode(String shareCode) {
            this.shareCode = shareCode;
            return this;
        }

        public WishlistBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public WishlistBuilder items(List<WishlistItem> items) {
            this.items = items;
            return this;
        }

        public Wishlist build() {
            return new Wishlist(id, user, name, type, isPublic, shareCode, createdAt, items);
        }
    }
}

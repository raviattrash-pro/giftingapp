package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class WishlistResponse {

    private Long id;
    private String name;
    private String type;
    private Boolean isPublic;
    private String shareCode;
    private LocalDateTime createdAt;
    private List<WishlistItemResponse> items;

    public WishlistResponse() {
    }

    public WishlistResponse(Long id, String name, String type, Boolean isPublic, String shareCode, LocalDateTime createdAt, List<WishlistItemResponse> items) {
        this.id = id;
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

    public List<WishlistItemResponse> getItems() {
        return this.items;
    }

    public void setItems(List<WishlistItemResponse> items) {
        this.items = items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishlistResponse that = (WishlistResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(isPublic, that.isPublic) &&
                java.util.Objects.equals(shareCode, that.shareCode) &&
                java.util.Objects.equals(createdAt, that.createdAt) &&
                java.util.Objects.equals(items, that.items);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, name, type, isPublic, shareCode, createdAt, items);
    }

    @Override
    public String toString() {
        return "WishlistResponse(id=" + id + ", name=" + name + ", type=" + type + ", isPublic=" + isPublic + ", shareCode=" + shareCode + ", createdAt=" + createdAt + ", items=" + items + ")";
    }

    public static WishlistResponseBuilder builder() {
        return new WishlistResponseBuilder();
    }

    public static class WishlistResponseBuilder {
        private Long id;
        private String name;
        private String type;
        private Boolean isPublic;
        private String shareCode;
        private LocalDateTime createdAt;
        private List<WishlistItemResponse> items;

        WishlistResponseBuilder() {
        }

        public WishlistResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WishlistResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public WishlistResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public WishlistResponseBuilder isPublic(Boolean isPublic) {
            this.isPublic = isPublic;
            return this;
        }

        public WishlistResponseBuilder shareCode(String shareCode) {
            this.shareCode = shareCode;
            return this;
        }

        public WishlistResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public WishlistResponseBuilder items(List<WishlistItemResponse> items) {
            this.items = items;
            return this;
        }

        public WishlistResponse build() {
            return new WishlistResponse(id, name, type, isPublic, shareCode, createdAt, items);
        }
    }

    public static class WishlistItemResponse {
        private Long id;
        private String name;
        private String description;
        private String url;
        private BigDecimal price;
        private String imageUrl;
        private Boolean isPurchased;

        public WishlistItemResponse() {
        }

        public WishlistItemResponse(Long id, String name, String description, String url, BigDecimal price, String imageUrl, Boolean isPurchased) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.url = url;
            this.price = price;
            this.imageUrl = imageUrl;
            this.isPurchased = isPurchased;
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

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            WishlistItemResponse that = (WishlistItemResponse) o;
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
            return "WishlistItemResponse(id=" + id + ", name=" + name + ", description=" + description + ", url=" + url + ", price=" + price + ", imageUrl=" + imageUrl + ", isPurchased=" + isPurchased + ")";
        }

        public static WishlistItemResponseBuilder builder() {
            return new WishlistItemResponseBuilder();
        }

        public static class WishlistItemResponseBuilder {
            private Long id;
            private String name;
            private String description;
            private String url;
            private BigDecimal price;
            private String imageUrl;
            private Boolean isPurchased;

            WishlistItemResponseBuilder() {
            }

            public WishlistItemResponseBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public WishlistItemResponseBuilder name(String name) {
                this.name = name;
                return this;
            }

            public WishlistItemResponseBuilder description(String description) {
                this.description = description;
                return this;
            }

            public WishlistItemResponseBuilder url(String url) {
                this.url = url;
                return this;
            }

            public WishlistItemResponseBuilder price(BigDecimal price) {
                this.price = price;
                return this;
            }

            public WishlistItemResponseBuilder imageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
                return this;
            }

            public WishlistItemResponseBuilder isPurchased(Boolean isPurchased) {
                this.isPurchased = isPurchased;
                return this;
            }

            public WishlistItemResponse build() {
                return new WishlistItemResponse(id, name, description, url, price, imageUrl, isPurchased);
            }
        }
    }
}

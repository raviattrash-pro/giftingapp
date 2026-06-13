package com.giftconcierge.dto;

import java.math.BigDecimal;
import java.util.List;

public class WishlistRequest {

    private String name;
    private String type;
    private Boolean isPublic;
    private List<WishlistItemRequest> items;

    public WishlistRequest() {
    }

    public WishlistRequest(String name, String type, Boolean isPublic, List<WishlistItemRequest> items) {
        this.name = name;
        this.type = type;
        this.isPublic = isPublic;
        this.items = items;
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

    public List<WishlistItemRequest> getItems() {
        return this.items;
    }

    public void setItems(List<WishlistItemRequest> items) {
        this.items = items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishlistRequest that = (WishlistRequest) o;
        return java.util.Objects.equals(name, that.name) &&
                java.util.Objects.equals(type, that.type) &&
                java.util.Objects.equals(isPublic, that.isPublic) &&
                java.util.Objects.equals(items, that.items);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, type, isPublic, items);
    }

    @Override
    public String toString() {
        return "WishlistRequest(name=" + name + ", type=" + type + ", isPublic=" + isPublic + ", items=" + items + ")";
    }

    public static WishlistRequestBuilder builder() {
        return new WishlistRequestBuilder();
    }

    public static class WishlistRequestBuilder {
        private String name;
        private String type;
        private Boolean isPublic;
        private List<WishlistItemRequest> items;

        WishlistRequestBuilder() {
        }

        public WishlistRequestBuilder name(String name) {
            this.name = name;
            return this;
        }

        public WishlistRequestBuilder type(String type) {
            this.type = type;
            return this;
        }

        public WishlistRequestBuilder isPublic(Boolean isPublic) {
            this.isPublic = isPublic;
            return this;
        }

        public WishlistRequestBuilder items(List<WishlistItemRequest> items) {
            this.items = items;
            return this;
        }

        public WishlistRequest build() {
            return new WishlistRequest(name, type, isPublic, items);
        }
    }

    public static class WishlistItemRequest {
        private String name;
        private String description;
        private String url;
        private BigDecimal price;
        private String imageUrl;

        public WishlistItemRequest() {
        }

        public WishlistItemRequest(String name, String description, String url, BigDecimal price, String imageUrl) {
            this.name = name;
            this.description = description;
            this.url = url;
            this.price = price;
            this.imageUrl = imageUrl;
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

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            WishlistItemRequest that = (WishlistItemRequest) o;
            return java.util.Objects.equals(name, that.name) &&
                    java.util.Objects.equals(description, that.description) &&
                    java.util.Objects.equals(url, that.url) &&
                    java.util.Objects.equals(price, that.price) &&
                    java.util.Objects.equals(imageUrl, that.imageUrl);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(name, description, url, price, imageUrl);
        }

        @Override
        public String toString() {
            return "WishlistItemRequest(name=" + name + ", description=" + description + ", url=" + url + ", price=" + price + ", imageUrl=" + imageUrl + ")";
        }

        public static WishlistItemRequestBuilder builder() {
            return new WishlistItemRequestBuilder();
        }

        public static class WishlistItemRequestBuilder {
            private String name;
            private String description;
            private String url;
            private BigDecimal price;
            private String imageUrl;

            WishlistItemRequestBuilder() {
            }

            public WishlistItemRequestBuilder name(String name) {
                this.name = name;
                return this;
            }

            public WishlistItemRequestBuilder description(String description) {
                this.description = description;
                return this;
            }

            public WishlistItemRequestBuilder url(String url) {
                this.url = url;
                return this;
            }

            public WishlistItemRequestBuilder price(BigDecimal price) {
                this.price = price;
                return this;
            }

            public WishlistItemRequestBuilder imageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
                return this;
            }

            public WishlistItemRequest build() {
                return new WishlistItemRequest(name, description, url, price, imageUrl);
            }
        }
    }
}

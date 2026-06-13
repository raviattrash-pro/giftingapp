package com.giftconcierge.dto;

public class RefreshTokenRequest {

    private String refreshToken;

    public RefreshTokenRequest() {
    }

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RefreshTokenRequest that = (RefreshTokenRequest) o;
        return java.util.Objects.equals(refreshToken, that.refreshToken);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(refreshToken);
    }

    @Override
    public String toString() {
        return "RefreshTokenRequest(refreshToken=" + refreshToken + ")";
    }

    public static RefreshTokenRequestBuilder builder() {
        return new RefreshTokenRequestBuilder();
    }

    public static class RefreshTokenRequestBuilder {
        private String refreshToken;

        RefreshTokenRequestBuilder() {
        }

        public RefreshTokenRequestBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public RefreshTokenRequest build() {
            return new RefreshTokenRequest(refreshToken);
        }
    }
}

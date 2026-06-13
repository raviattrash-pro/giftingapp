package com.giftconcierge.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, UserResponse user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
        this.user = user;
    }

    public AuthResponse(String accessToken, String refreshToken, String tokenType, UserResponse user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.user = user;
    }

    public String getAccessToken() {
        return this.accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return this.tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserResponse getUser() {
        return this.user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthResponse that = (AuthResponse) o;
        return java.util.Objects.equals(accessToken, that.accessToken) &&
                java.util.Objects.equals(refreshToken, that.refreshToken) &&
                java.util.Objects.equals(tokenType, that.tokenType) &&
                java.util.Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(accessToken, refreshToken, tokenType, user);
    }

    @Override
    public String toString() {
        return "AuthResponse(accessToken=" + accessToken + ", refreshToken=" + refreshToken + ", tokenType=" + tokenType + ", user=" + user + ")";
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private UserResponse user;

        AuthResponseBuilder() {
        }

        public AuthResponseBuilder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public AuthResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public AuthResponseBuilder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }

        public AuthResponseBuilder user(UserResponse user) {
            this.user = user;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(accessToken, refreshToken, tokenType, user);
        }
    }
}

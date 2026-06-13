package com.giftconcierge.security;

import com.giftconcierge.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;

public class UserPrincipal implements UserDetails {

    private Long id;
    private String email;
    private String password;
    private String fullName;
    private Boolean premium;
    private String role;

    public UserPrincipal(Long id, String email, String password, String fullName, Boolean premium, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.premium = premium;
        this.role = role;
    }

    public static UserPrincipal create(User user) {
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getPremium(),
                user.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public Boolean getPremium() {
        return premium;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        java.util.List<GrantedAuthority> authorities = new java.util.ArrayList<>();
        String authorityName = (role != null && role.startsWith("ROLE_")) ? role : "ROLE_" + (role != null ? role : "USER");
        authorities.add(new SimpleGrantedAuthority(authorityName));
        if (Boolean.TRUE.equals(premium)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_PREMIUM"));
        }
        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

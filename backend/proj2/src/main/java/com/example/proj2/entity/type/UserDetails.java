package com.example.proj2.entity.type;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Date;

public interface UserDetails {
    Collection<? extends GrantedAuthority> getAuthorities();

    boolean isAccountNonExpired();

    boolean isAccountNonLocked();

   boolean isCredentialsNonExpired();

    boolean isEnabled();

    String getUsername();
}

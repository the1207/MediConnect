package com.Mediconnect.security.dto;

import lombok.Builder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public class UserRoleReponse {
    private Long id;
    private String fullName;
    private String username;
    private LocalDateTime createDate;
    private boolean enable;
    private String roles;
    private UUID publicId;

    public UserRoleReponse() {
    }

    public UserRoleReponse(Long id, String fullName, String username, LocalDateTime createDate, boolean enable, String roles, UUID publicId) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.createDate=createDate;
        this.enable = enable;
        this.roles = roles;
        this.publicId = publicId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getcreateDate(Instant createDate) {
        return this.createDate;
    }

    public void setcreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public boolean isEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }
}

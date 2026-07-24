package com.Mediconnect.security.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public class UserDTO {

    private String fullName;
    private String username;
    private String password;
    private String roles;
    private boolean enable;
    private UUID publicId;
    private Long medecinId;

    public UserDTO() {
    }

    public UserDTO(String fullName, String username, String password, String roles, boolean enable,
                   UUID publicId, Long medecinId) {
        this.fullName = fullName;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.enable = enable;
        this.publicId = publicId;
        this.medecinId = medecinId;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public boolean isEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }

    public Long getMedecinId() {
        return medecinId;
    }

    public void setMedecinId(Long medecinId) {
        this.medecinId = medecinId;
    }
}
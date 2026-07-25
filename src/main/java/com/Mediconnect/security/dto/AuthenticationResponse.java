package com.Mediconnect.security.dto;

import java.util.List;
import java.util.UUID;

public record AuthenticationResponse(
        String token,
        UUID id,
        String fullName,
        String username,
        List<String> roles
) {
}
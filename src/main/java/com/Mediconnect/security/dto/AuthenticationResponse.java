package com.Mediconnect.security.dto;

import java.util.List;
import java.util.UUID;

public record AuthenticationResponse(
        String token,
        UUID id,
        Long userId,
        String fullName,
        String username,
        List<String> roles,
        Long medecinId
) {
}
package com.Mediconnect.Dto.DtoRequest;

public record MedicamentDtoRequest(
        String nom,
        String regle,
        Integer dureeTraitement,
        Long ordonnanceId
) {
}
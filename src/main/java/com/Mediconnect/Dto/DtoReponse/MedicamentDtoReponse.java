package com.Mediconnect.Dto.DtoReponse;

public record MedicamentDtoReponse(
        String nom,
        String regle,
        Integer dureeTraitement,
        Long ordonnanceId
) {
}
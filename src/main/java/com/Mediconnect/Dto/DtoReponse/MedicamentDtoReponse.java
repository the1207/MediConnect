package com.Mediconnect.Dto.DtoReponse;

public record MedicamentDtoReponse(
        Long id,
        String nom,
        String posologie,
        Integer dureeTraitement,
        Long ordonnanceId
) {
}

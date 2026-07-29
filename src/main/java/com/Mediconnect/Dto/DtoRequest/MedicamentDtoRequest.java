package com.Mediconnect.Dto.DtoRequest;

public record MedicamentDtoRequest(
        String nom,
        String posologie,
        Integer dureeTraitement,
        Long ordonnanceId
) {
}

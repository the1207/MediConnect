package com.Mediconnect.Dto.DtoReponse;

public record ConstanteDtoReponse(
        Double temperature,
        Double poids,
        String tensionArteriel,
        boolean alerte,
        Long patientId,
        Long medecinId
) {
}
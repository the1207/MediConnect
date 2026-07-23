package com.Mediconnect.Dto.DtoRequest;

public record ConstanteDtoRequest(
        Double temperature,
        Double poids,
        String tensionArteriel,
        Long patientId,
        Long medecinId
) {
}
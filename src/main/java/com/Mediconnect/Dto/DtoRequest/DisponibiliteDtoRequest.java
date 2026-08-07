package com.Mediconnect.Dto.DtoRequest;

public record DisponibiliteDtoRequest(
        String dateCreneau,
        String heureDebut,
        String heureFin,
        Long medecinId
) {
}

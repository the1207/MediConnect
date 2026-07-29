package com.Mediconnect.Dto.DtoReponse;

import java.time.LocalDateTime;

public record ConstanteDtoReponse(
        Long id,
        Double temperature,
        Double poids,
        String tensionArteriel,
        boolean alerte,
        boolean alerteTemperature,
        boolean alertePoids,
        boolean alerteTension,
        LocalDateTime date,
        Long patientId,
        String patientNom,
        String patientPrenom,
        Long medecinId,
        Long infirmiereId,
        String infirmiereNom,
        String motifVisite,
        String priorite
) {
}

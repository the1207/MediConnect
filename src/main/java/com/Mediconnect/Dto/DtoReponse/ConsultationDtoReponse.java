package com.Mediconnect.Dto.DtoReponse;

import java.time.LocalDateTime;

public record ConsultationDtoReponse(
        LocalDateTime dateDebut,
        String motif,
        String actionsRequis,
        Long patientId,
        Long ordonnanceId,
        Long medecinId
){
}

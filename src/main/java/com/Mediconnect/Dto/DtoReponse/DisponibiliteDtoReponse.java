package com.Mediconnect.Dto.DtoReponse;

import java.sql.Time;
import java.util.Date;

public record DisponibiliteDtoReponse(
        Long id,
        Date dateCreneau,
        Time heureDebut,
        Time heureFin,
        Long medecinId,
        Boolean reservation
) {
}
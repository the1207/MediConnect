package com.Mediconnect.Dto.DtoReponse;

import java.sql.Time;
import java.util.Date;

public record DisponibiliteDtoReponse(
        Date dateCreneau,
        Time heureDebut,
        Time heureFin,
        Long medecinId

) {
}

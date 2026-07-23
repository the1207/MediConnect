package com.Mediconnect.Dto.DtoRequest;

import java.sql.Time;
import java.util.Date;

public record DisponibiliteDtoRequest(
        Date dateCreneau,
        Time heureDebut,
        Time heureFin,
        Long medecinId
) {
}

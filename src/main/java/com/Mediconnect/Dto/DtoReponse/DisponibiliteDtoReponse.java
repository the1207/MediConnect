package com.Mediconnect.Dto.DtoReponse;

import java.sql.Time;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public record DisponibiliteDtoReponse(
        Long id,
        @JsonFormat(pattern = "yyyy-MM-dd")
        Date dateCreneau,
        @JsonFormat(pattern = "HH:mm:ss")
        Time heureDebut,
        @JsonFormat(pattern = "HH:mm:ss")
        Time heureFin,
        Long medecinId,
        Boolean reservation
) {
}
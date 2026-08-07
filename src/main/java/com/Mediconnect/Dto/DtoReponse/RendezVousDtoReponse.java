package com.Mediconnect.Dto.DtoReponse;

import java.sql.Time;
import java.util.Date;

import com.Mediconnect.enumeration.Statut;
import com.fasterxml.jackson.annotation.JsonFormat;

public record RendezVousDtoReponse(
        Long id,
        @JsonFormat(pattern = "yyyy-MM-dd")
        Date date,
        @JsonFormat(pattern = "HH:mm:ss")
        Time heure,
        Statut statut,
        String motif,
        Long disponibiliteId,
        Long patientId,
        Long medecinId
) {
}
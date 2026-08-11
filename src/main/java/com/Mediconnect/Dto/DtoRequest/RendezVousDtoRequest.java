package com.Mediconnect.Dto.DtoRequest;

import java.sql.Time;
import java.util.Date;

import com.Mediconnect.enumeration.Statut;
import com.fasterxml.jackson.annotation.JsonFormat;

public record RendezVousDtoRequest(
        @JsonFormat(pattern = "yyyy-MM-dd")
        Date date,
        @JsonFormat(pattern = "HH:mm:ss")
        Time heure,
        @JsonFormat(pattern = "HH:mm:ss")
        Time heureFin,
        Statut statut,
        String motif,
        Long patientId,
        Long medecinId,
        Long disponibiliteId
) {
}
package com.Mediconnect.Dto.DtoRequest;

import java.sql.Time;
import java.util.Date;

import com.Mediconnect.enumeration.Statut;

public record RendezVousDtoRequest(
        Date date,
        Time heure,
        Statut statut,
        String motif,
        Long patientId,
        Long medecinId,
        Long disponibiliteId
) {
}
package com.Mediconnect.Dto.DtoReponse;

import java.sql.Time;
import java.util.Date;

import com.Mediconnect.enumeration.Statut;

public record RendezVousDtoReponse(
        Long id,
        Date date,
        Time heure,
        Statut statut,
        String motif,
        Long disponibiliteId,
        Long patientId,
        Long medecinId
) {
}
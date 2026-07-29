package com.Mediconnect.Dto.DtoRequest;

import com.Mediconnect.enumeration.StatutOrdonnance;

import java.util.List;

public record OrdonnanceDtoRequest(
        Long patientId,
        Long medecinId,
        String commentaire,
        StatutOrdonnance statut,
        List<MedicamentDtoRequest> medicaments
) {
}

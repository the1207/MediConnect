package com.Mediconnect.Dto.DtoReponse;

import com.Mediconnect.enumeration.StatutOrdonnance;

import java.time.LocalDateTime;
import java.util.List;

public record OrdonnanceDtoReponse(
        Long id,
        LocalDateTime dateCreation,
        String commentaire,
        StatutOrdonnance statut,
        Long patientId,
        String patientNom,
        String patientPrenom,
        Long medecinId,
        String medecinNom,
        List<MedicamentDtoReponse> medicaments
) {
}

package com.Mediconnect.Dto.DtoReponse;

import java.util.Date;

public record PatientDtoReponse(
        Long id,
        String nom,
        String prenom,
        Date dateNaissance,
        char sexe,
        String contact,
        String allergies,
        String antecedents,
        String groupeSanguin
) {
}

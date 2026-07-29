package com.Mediconnect.Dto.DtoRequest;

import java.util.Date;

public record PatientDtoRequest(
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

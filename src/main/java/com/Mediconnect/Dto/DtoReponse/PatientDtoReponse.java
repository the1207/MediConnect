package com.Mediconnect.Dto.DtoReponse;

import java.util.Date;

public record PatientDtoReponse(
        String nom,
        String prenom,
        Date dateNaissance,
        char sexe,
        String contact

) {
}

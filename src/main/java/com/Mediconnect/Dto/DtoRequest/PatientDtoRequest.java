package com.Mediconnect.Dto.DtoRequest;

import com.Mediconnect.Entities.Constante;

import java.util.Date;

public record PatientDtoRequest(
        String nom,
        String prenom,
        Date dateNaissance,
        char sexe,
        String contact
) {
}

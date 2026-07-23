package com.Mediconnect.Dto.DtoRequest;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Entities.Disponibilite;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

import java.util.List;

public record MedecinDtoRequest(
        String nom,
        String prenom,
        Long specialiteId,
        Long disponibiliteId,
        Long consultationId,
        Long constanteId,
        Long rendezVousId
) {
}

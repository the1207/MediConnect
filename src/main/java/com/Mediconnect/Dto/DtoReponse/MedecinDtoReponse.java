package com.Mediconnect.Dto.DtoReponse;

import java.util.List;

public record MedecinDtoReponse(
        Long id,
        String nom,
        String prenom,
        SpecialiteDtoReponse specialite,
        List<DisponibiliteDtoReponse> disponibilites,
        List<ConsultationDtoReponse> consultations,
        List<ConstanteDtoReponse> constantes,
        List<RendezVousDtoReponse> rendezVous
) {}
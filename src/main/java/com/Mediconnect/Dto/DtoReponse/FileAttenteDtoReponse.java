package com.Mediconnect.Dto.DtoReponse;

public record FileAttenteDtoReponse(
    Long id,
    Long patientId,
    String patientNom,
    String patientPrenom,
    String motifVisite,
    String priorite,
    String statut,
    String heureArrivee,
    boolean alertes,
    Double temperature,
    Double poids,
    String tensionArteriel,
    String infirmiereNom
) {}

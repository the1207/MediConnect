package com.Mediconnect.Dto.DtoRequest;

public record FileAttenteDtoRequest(
    Long patientId,
    String motifVisite,
    String priorite,
    Long constanteId
) {}

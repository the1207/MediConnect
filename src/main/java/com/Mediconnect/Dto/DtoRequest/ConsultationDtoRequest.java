package com.Mediconnect.Dto.DtoRequest;

import com.Mediconnect.Entities.*;

import java.time.LocalDateTime;
import java.util.List;

public record ConsultationDtoRequest(
        String motif,
        String actionsRequis,
        Long medecinId,
        Long patientId,
        Long ordonnanceId

) {
}

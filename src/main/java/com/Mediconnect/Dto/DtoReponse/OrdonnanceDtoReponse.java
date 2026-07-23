package com.Mediconnect.Dto.DtoReponse;

import com.Mediconnect.Entities.Medicament;

import java.time.LocalDateTime;
import java.util.List;

public record OrdonnanceDtoReponse(
        LocalDateTime dateCreation,
        String commentaire,
        List<MedicamentDtoReponse> medicament
) {
}

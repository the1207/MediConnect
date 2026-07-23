package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedicamentDtoRequest;

import java.util.List;

public interface MedicamentService {
    MedicamentDtoReponse Create(MedicamentDtoRequest medicamentDtoRequest);
    MedicamentDtoReponse GetMedicament(Long id);
    MedicamentDtoReponse Update(Long id, MedicamentDtoRequest medicamentDtoRequest);
    void Delete(Long id);
    List<MedicamentDtoReponse> GetAllMedicament();
    List<MedicamentDtoReponse> GetMedicamentByOrdonnance(Long ordonnanceId);
    List<MedicamentDtoReponse> GetMedicamentByPatient(Long patientId);
    List<MedicamentDtoReponse> GetMedicamentByMedecin(Long medecinId);
}
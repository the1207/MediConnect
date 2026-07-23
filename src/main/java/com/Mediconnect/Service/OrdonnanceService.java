package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;

import java.util.List;

public interface OrdonnanceService {
    OrdonnanceDtoReponse Create(OrdonnanceDtoRequest ordonnanceDtoRequest);
    OrdonnanceDtoReponse GetOrdonnance(Long id);
    OrdonnanceDtoReponse Update(Long id,OrdonnanceDtoRequest ordonnanceDtoRequest);
    void Delete(Long id);
    List<OrdonnanceDtoReponse> GetAllOrdonnance();
    String imprimer(Long id);
    List<OrdonnanceDtoReponse> GetOrdonnanceByPatient(Long patientId);
    List<OrdonnanceDtoReponse> GetOrdonnanceByMedecin(Long medecinId);
}
package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;

import java.util.List;

public interface RendezVousService {
    List<RendezVousDtoReponse> GetAllRendezVous(Long id);
    RendezVousDtoReponse GetRendezVous(Long id);
    void Delete(Long id);
    void Confirmer(Long id);
    void Refuser(Long id);
    List<RendezVousDtoReponse> GetByMedecin(Long medecinId);
    List<RendezVousDtoReponse> GetConfirmesByMedecin(Long medecinId);
}
package com.Mediconnect.Service;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.MedecinDtoReponse;
import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedecinDtoRequest;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;

public interface MedecinService {
    MedecinDtoReponse Create(MedecinDtoRequest medecinDtoRequest);
    MedecinDtoReponse GetMedecin(Long id);
    MedecinDtoReponse Update(Long id, MedecinDtoRequest medecinDtoRequest);
    void Delete(Long id);
    List<MedecinDtoReponse> GetAllMedecin();
    List<ConsultationDtoReponse> consulterHistorique(Long id);
    RendezVousDtoReponse ajouterRendezVous(RendezVousDtoRequest rendezVousDtoRequest);
    List<MedecinDtoReponse> GetMedecinsBySpecialite(Long specialiteId);
}
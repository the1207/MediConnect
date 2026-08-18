package com.Mediconnect.Service;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;

public interface DisponibiliteService {
    DisponibiliteDtoReponse Create(DisponibiliteDtoRequest disponibiliteDtoRequest);
    DisponibiliteDtoReponse GetDisponibilite(Long id);
    DisponibiliteDtoReponse Update(Long id, DisponibiliteDtoRequest disponibiliteDtoRequest);
    void Delete(Long id);
    List<DisponibiliteDtoReponse> GetAllDisponibilite();
    void liberer(Long id);

    void reserver(Long id);

    void toggleActif(Long id, boolean actif);

    List<DisponibiliteDtoReponse> GetByMedecin(Long medecinId);
}

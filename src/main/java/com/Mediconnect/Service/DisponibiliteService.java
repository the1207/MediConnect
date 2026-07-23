package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;

import java.util.List;

public interface DisponibiliteService {
    DisponibiliteDtoReponse Create(DisponibiliteDtoRequest disponibiliteDtoRequest);
    DisponibiliteDtoReponse GetDisponibilite(Long id);
    DisponibiliteDtoReponse Update(Long id, DisponibiliteDtoRequest disponibiliteDtoRequest);
    void Delete(Long id);
    List<DisponibiliteDtoReponse> GetAllDisponibilite();
    void liberer(Long id);

    void reserver(Long id);
}

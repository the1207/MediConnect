package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.SeuilAlerteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SeuilAlerteDtoRequest;
import com.Mediconnect.enumeration.TypeConstante;

import java.util.List;

public interface SeuilAlerteService {
    SeuilAlerteDtoReponse create(SeuilAlerteDtoRequest dto);
    SeuilAlerteDtoReponse update(Long id, SeuilAlerteDtoRequest dto);
    void delete(Long id);
    SeuilAlerteDtoReponse getById(Long id);
    SeuilAlerteDtoReponse getByType(TypeConstante type);
    List<SeuilAlerteDtoReponse> getAll();
    boolean isAlerteTemperature(Double temperature);
    boolean isAlertePoids(Double poids);
    boolean isAlerteTension(String tension);
}

package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConstanteDtoRequest;
import com.Mediconnect.Entities.Constante;

import java.util.List;

public interface ConstanteService {
    ConstanteDtoReponse Create(ConstanteDtoRequest constanteDtoRequest);
    ConstanteDtoReponse GetConstante(Long id);
    ConstanteDtoReponse Update(Long id, ConstanteDtoRequest constanteDtoRequest);
    void Delete(Long id);
    List<ConstanteDtoReponse> GetAllConstante();
    List<ConstanteDtoReponse> GetConstanteByPatient(Long patientId);
}
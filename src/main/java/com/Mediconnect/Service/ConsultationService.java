package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConsultationDtoRequest;
import com.Mediconnect.Entities.Consultation;

import java.util.List;

public interface ConsultationService {
    ConsultationDtoReponse Create(ConsultationDtoRequest consultationDtoRequest);
    ConsultationDtoReponse GetConsultation(Long id);
    ConsultationDtoReponse Update(Long id, ConsultationDtoRequest consultationDtoRequest);
    void Delete(Long id);
    List<ConsultationDtoReponse> GetAllConsultation();
}

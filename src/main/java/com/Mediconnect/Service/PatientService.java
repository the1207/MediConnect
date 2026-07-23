package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;
import com.Mediconnect.Entities.Patient;

import java.util.List;

public interface PatientService {
    PatientDtoReponse Create(PatientDtoRequest patientDtoRequest);
    PatientDtoReponse GetPatient(Long id);
    PatientDtoReponse Update(Long id, PatientDtoRequest patientDtoRequest);
    void Delete(Long id);
    List<PatientDtoReponse> GetAllPatient();
    List<ConsultationDtoReponse> consulterHistorique(Long id);
    List<PatientDtoReponse> RechercherPatient(String nom);
}
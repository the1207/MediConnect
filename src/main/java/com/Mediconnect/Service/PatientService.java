package com.Mediconnect.Service;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;

public interface PatientService {
    PatientDtoReponse Create(PatientDtoRequest patientDtoRequest);
    PatientDtoReponse GetPatient(Long id);
    PatientDtoReponse Update(Long id, PatientDtoRequest patientDtoRequest);
    void Delete(Long id);
    List<PatientDtoReponse> GetAllPatient();    List<PatientDtoReponse> GetByMedecin(Long medecinId);    List<ConsultationDtoReponse> consulterHistorique(Long id);
    List<PatientDtoReponse> RechercherPatient(String nom);
}
package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Entities.Patient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PatientMapper {
    public Patient toEntity(PatientDtoRequest patientDtoRequest){
        Patient patient = new Patient();
        patient.setNom(patientDtoRequest.nom());
        patient.setPrenom(patientDtoRequest.prenom());
        patient.setDateNaissance(patientDtoRequest.dateNaissance());
        patient.setSexe(patientDtoRequest.sexe());
        patient.setContact(patientDtoRequest.contact());
        return patient;
    }
    public PatientDtoReponse toReponse(Patient patient){
        return new PatientDtoReponse(
                patient.getNom(),
                patient.getPrenom(),
                patient.getDateNaissance(),
                patient.getSexe(),
                patient.getContact()
        );

    }
    public List<PatientDtoReponse> toReponseList(List<Patient> patientList){
        return patientList.stream().map(this::toReponse).toList();
    }
}

package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;
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
        patient.setAllergies(patientDtoRequest.allergies());
        patient.setAntecedents(patientDtoRequest.antecedents());
        patient.setGroupeSanguin(patientDtoRequest.groupeSanguin());
        return patient;
    }

    public PatientDtoReponse toReponse(Patient patient){
        return new PatientDtoReponse(
                patient.getId(),
                patient.getNom(),
                patient.getPrenom(),
                patient.getDateNaissance(),
                patient.getSexe(),
                patient.getContact(),
                patient.getAllergies(),
                patient.getAntecedents(),
                patient.getGroupeSanguin()
        );
    }

    public List<PatientDtoReponse> toReponseList(List<Patient> patientList){
        return patientList.stream().map(this::toReponse).toList();
    }
}

package com.Mediconnect.Service.implementation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.Repositories.ConsultationRepository;
import com.Mediconnect.Repositories.PatientRepository;
import com.Mediconnect.Repositories.RendezVousRepository;
import com.Mediconnect.Service.PatientService;
import com.Mediconnect.mapper.ConsultationMapper;
import com.Mediconnect.mapper.PatientMapper;
@Service
public class PatientImplementation implements PatientService {
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;
    private final RendezVousRepository rendezVousRepository;

    public PatientImplementation(PatientRepository patientRepository, PatientMapper patientMapper, ConsultationRepository consultationRepository, ConsultationMapper consultationMapper, RendezVousRepository rendezVousRepository) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
        this.consultationRepository = consultationRepository;
        this.consultationMapper = consultationMapper;
        this.rendezVousRepository = rendezVousRepository;
    }
    @Override
    public PatientDtoReponse Create(PatientDtoRequest PatientDtoRequest){
        Patient patient = patientMapper.toEntity(PatientDtoRequest);
        Patient patient1 = patientRepository.save(patient);
        return patientMapper.toReponse(patient1);
    }
    @Override
    public PatientDtoReponse GetPatient(Long id){
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur Patient non trouve"));
        return patientMapper.toReponse(patient);
    }
    @Override
    public PatientDtoReponse Update(Long id, PatientDtoRequest patientDtoRequest){
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur Patient non trouve"));
        patient.setNom(patientDtoRequest.nom());
        patient.setPrenom(patientDtoRequest.prenom());
        patient.setDateNaissance(patientDtoRequest.dateNaissance());
        patient.setSexe(patientDtoRequest.sexe());
        patient.setContact(patientDtoRequest.contact());
        patientRepository.save(patient);
        return patientMapper.toReponse(patient);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("erreur Patient non trouve");
        }
        patientRepository.deleteById(id);
    }
    @Override
    public List<PatientDtoReponse> GetAllPatient(){
        List<Patient> patientList = patientRepository.findAll();
        return patientMapper.toReponseList(patientList);
    }

    @Override
    public List<PatientDtoReponse> GetByMedecin(Long medecinId) {
        List<RendezVous> rendezVousList = rendezVousRepository.findByMedecinId(medecinId);
        List<Patient> patients = new ArrayList<>();
        Set<Long> patientIds = new HashSet<>();

        for (RendezVous rendezVous : rendezVousList) {
            if (rendezVous.getPatient() != null && rendezVous.getPatient().getId() != null) {
                Long id = rendezVous.getPatient().getId();
                if (patientIds.add(id)) {
                    patients.add(rendezVous.getPatient());
                }
            }
        }

        List<Consultation> consultationList = consultationRepository.findByMedecinId(medecinId);
        for (Consultation consultation : consultationList) {
            if (consultation.getPatient() != null && consultation.getPatient().getId() != null) {
                Long id = consultation.getPatient().getId();
                if (patientIds.add(id)) {
                    patients.add(consultation.getPatient());
                }
            }
        }

        return patientMapper.toReponseList(patients);
    }

    @Override
    public List<ConsultationDtoReponse> consulterHistorique(Long id) {
        List<Consultation> consultationList = consultationRepository.findByPatientId(id);

        // conversion en objets de reponse, comme d'habitude
        return consultationMapper.toReponseList(consultationList);
    }

    @Override
    public List<PatientDtoReponse> RechercherPatient(String nom) {
        List<Patient> patientList = patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(nom, nom);
        return patientMapper.toReponseList(patientList);
    }
}
package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConsultationDtoRequest;
import com.Mediconnect.Entities.*;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import com.Mediconnect.Repositories.PatientRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConsultationMapper {
    private final MedecinRepository medecinRepository;
    private final PatientRepository patientRepository;
    private final DisponibiliteRepository disponibiliteRepository;
    private final OrdonnanceRepository ordonnanceRepository;

    public ConsultationMapper(MedecinRepository medecinRepository, PatientRepository patientRepository,
                              DisponibiliteRepository disponibiliteRepository, OrdonnanceRepository ordonnanceRepository) {
        this.medecinRepository = medecinRepository;
        this.patientRepository = patientRepository;
        this.disponibiliteRepository = disponibiliteRepository;
        this.ordonnanceRepository = ordonnanceRepository;
    }

    public Consultation toEntity(ConsultationDtoRequest consultationDtoRequest){
        Consultation consultation = new Consultation();
        consultation.setActionsRequis(consultationDtoRequest.actionsRequis());
        consultation.setMotif(consultationDtoRequest.motif());

        if (consultationDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(consultationDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            consultation.setMedecin(medecin);
        }
        if (consultationDtoRequest.patientId() != null) {
            Patient patient = patientRepository.findById(consultationDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("erreur patient non trouve"));
            consultation.setPatient(patient);
        }
        if (consultationDtoRequest.ordonnanceId() != null) {
            Ordonnance ordonnance = ordonnanceRepository.findById(consultationDtoRequest.ordonnanceId())
                    .orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
            consultation.setOrdonnance(ordonnance);
        }

        return consultation;
    }

    public ConsultationDtoReponse toReponse(Consultation consultation){
        return new ConsultationDtoReponse(
                consultation.getDateDebut(),
                consultation.getMotif(),
                consultation.getActionsRequis(),
                consultation.getPatient() != null ? consultation.getPatient().getId() : null,
                consultation.getOrdonnance() != null ? consultation.getOrdonnance().getId() : null,
                consultation.getMedecin() != null ? consultation.getMedecin().getId() : null
        );
    }

    public List<ConsultationDtoReponse> toReponseList(List<Consultation> consultationList){
        return consultationList.stream().map(this::toReponse).toList();
    }
}
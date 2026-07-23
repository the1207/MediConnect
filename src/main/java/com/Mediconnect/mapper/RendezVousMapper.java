package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.PatientRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RendezVousMapper {
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final DisponibiliteRepository disponibiliteRepository;

    public RendezVousMapper(PatientRepository patientRepository, MedecinRepository medecinRepository,
                            DisponibiliteRepository disponibiliteRepository) {
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.disponibiliteRepository = disponibiliteRepository;
    }

    public RendezVous toEntity(RendezVousDtoRequest rendezVousDtoRequest){
        RendezVous rendezVous = new RendezVous();
        rendezVous.setDate(rendezVousDtoRequest.date());
        rendezVous.setHeure(rendezVousDtoRequest.heure());
        rendezVous.setStatut(rendezVousDtoRequest.statut());
        rendezVous.setMotif(rendezVousDtoRequest.motif());

        if (rendezVousDtoRequest.patientId() != null) {
            Patient patient = patientRepository.findById(rendezVousDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("erreur patient non trouve"));
            rendezVous.setPatient(patient);
        }
        if (rendezVousDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(rendezVousDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            rendezVous.setMedecin(medecin);
        }
        if (rendezVousDtoRequest.disponibiliteId() != null) {
            Disponibilite disponibilite = disponibiliteRepository.findById(rendezVousDtoRequest.disponibiliteId())
                    .orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));
            rendezVous.setDisponibilite(disponibilite);
        }

        return rendezVous;
    }

    public RendezVousDtoReponse toReponse(RendezVous rendezVous){
        return new RendezVousDtoReponse(
                rendezVous.getDate(),
                rendezVous.getHeure(),
                rendezVous.getStatut(),
                rendezVous.getMotif(),
                rendezVous.getDisponibilite() != null ? rendezVous.getDisponibilite().getId() : null,
                rendezVous.getPatient() != null ? rendezVous.getPatient().getId() : null,
                rendezVous.getMedecin() != null ? rendezVous.getMedecin().getId() : null
        );
    }

    public List<RendezVousDtoReponse> toReponseList(List<RendezVous> rendezVousList){
        return rendezVousList.stream().map(this::toReponse).toList();
    }
}
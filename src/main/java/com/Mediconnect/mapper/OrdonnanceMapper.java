package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Entities.Medicament;
import com.Mediconnect.Entities.Ordonnance;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.PatientRepository;
import com.Mediconnect.enumeration.StatutOrdonnance;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class OrdonnanceMapper {
    private final MedicamentMapper medicamentMapper;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;

    public OrdonnanceMapper(MedicamentMapper medicamentMapper, PatientRepository patientRepository, MedecinRepository medecinRepository) {
        this.medicamentMapper = medicamentMapper;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
    }

    public Ordonnance toEntity(OrdonnanceDtoRequest ordonnanceDtoRequest){
        Ordonnance ordonnance = new Ordonnance();
        ordonnance.setCommentaire(ordonnanceDtoRequest.commentaire());
        ordonnance.setDateCreation(LocalDateTime.now());
        ordonnance.setStatut(ordonnanceDtoRequest.statut() != null ? ordonnanceDtoRequest.statut() : StatutOrdonnance.REDIGEE);

        if (ordonnanceDtoRequest.patientId() != null) {
            Patient patient = patientRepository.findById(ordonnanceDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("Patient non trouve"));
            ordonnance.setPatient(patient);
        }

        if (ordonnanceDtoRequest.medecinId() != null) {
            medecinRepository.findById(ordonnanceDtoRequest.medecinId())
                    .ifPresent(ordonnance::setMedecin);
        }

        if (ordonnanceDtoRequest.medicaments() != null) {
            List<Medicament> medicaments = new ArrayList<>();
            for (var medDto : ordonnanceDtoRequest.medicaments()) {
                Medicament medicament = new Medicament();
                medicament.setNom(medDto.nom());
                medicament.setPosologie(medDto.posologie());
                medicament.setDureeTraitement(medDto.dureeTraitement());
                medicament.setOrdonnance(ordonnance);
                medicaments.add(medicament);
            }
            ordonnance.setMedicament(medicaments);
        }

        return ordonnance;
    }

    public OrdonnanceDtoReponse toReponse(Ordonnance ordonnance){
        List<MedicamentDtoReponse> medicaments;
        if (ordonnance.getMedicament() != null) {
            medicaments = medicamentMapper.toReponseList(ordonnance.getMedicament());
        } else {
            medicaments = List.<MedicamentDtoReponse>of();
        }

        return new OrdonnanceDtoReponse(
                ordonnance.getId(),
                ordonnance.getDateCreation(),
                ordonnance.getCommentaire(),
                ordonnance.getStatut(),
                ordonnance.getPatient() != null ? ordonnance.getPatient().getId() : null,
                ordonnance.getPatient() != null ? ordonnance.getPatient().getNom() : null,
                ordonnance.getPatient() != null ? ordonnance.getPatient().getPrenom() : null,
                ordonnance.getMedecin() != null ? ordonnance.getMedecin().getId() : null,
                ordonnance.getMedecin() != null ? ordonnance.getMedecin().getNom() : null,
                medicaments
        );
    }

    public List<OrdonnanceDtoReponse> toReponseList(List<Ordonnance> ordonnanceList){
        return ordonnanceList.stream().map(this::toReponse).toList();
    }
}

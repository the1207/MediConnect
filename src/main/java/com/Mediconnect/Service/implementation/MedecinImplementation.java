package com.Mediconnect.Service.implementation;

import java.sql.Time;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.MedecinDtoReponse;
import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedecinDtoRequest;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Repositories.ConsultationRepository;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.RendezVousRepository;
import com.Mediconnect.Repositories.SpecialiteRepository;
import com.Mediconnect.Service.MedecinService;
import com.Mediconnect.enumeration.Statut;
import com.Mediconnect.mapper.ConsultationMapper;
import com.Mediconnect.mapper.MedecinMapper;
import com.Mediconnect.mapper.RendezVousMapper;

@Service
public class MedecinImplementation implements MedecinService {
    private final MedecinRepository medecinRepository;
    private final com.Mediconnect.Repositories.PatientRepository patientRepository;
    private final MedecinMapper medecinMapper;
    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;
    private final SpecialiteRepository specialiteRepository;
    private final RendezVousRepository rendezVousRepository;
    private final RendezVousMapper rendezVousMapper;
    private final DisponibiliteRepository disponibiliteRepository;

    public MedecinImplementation(MedecinRepository medecinRepository, MedecinMapper medecinMapper,
                                 SpecialiteRepository specialiteRepository, ConsultationRepository consultationRepository,
                                 ConsultationMapper consultationMapper, RendezVousRepository rendezVousRepository,
                                 RendezVousMapper rendezVousMapper, DisponibiliteRepository disponibiliteRepository,
                                 com.Mediconnect.Repositories.PatientRepository patientRepository) {
        this.medecinRepository = medecinRepository;
        this.medecinMapper = medecinMapper;
        this.consultationRepository = consultationRepository;
        this.consultationMapper = consultationMapper;
        this.specialiteRepository = specialiteRepository;
        this.rendezVousRepository = rendezVousRepository;
        this.rendezVousMapper = rendezVousMapper;
        this.disponibiliteRepository = disponibiliteRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public MedecinDtoReponse Create(MedecinDtoRequest medecinDtoRequest) {
        Medecin medecin = medecinMapper.toEntity(medecinDtoRequest);
        Medecin medecin1 = medecinRepository.save(medecin);
        return medecinMapper.toReponse(medecin1);
    }

    @Override
    public MedecinDtoReponse GetMedecin(Long id) {
        Medecin medecin = medecinRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
        return medecinMapper.toReponse(medecin);
    }

    @Override
    public MedecinDtoReponse Update(Long id, MedecinDtoRequest medecinDtoRequest) {
        Medecin medecin = medecinRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
        medecin.setNom(medecinDtoRequest.nom());
        medecin.setPrenom(medecinDtoRequest.prenom());

        if (medecinDtoRequest.specialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(medecinDtoRequest.specialiteId())
                    .orElseThrow(() -> new RuntimeException("erreur specialite non trouve"));
            medecin.setSpecialite(specialite);
        }

        medecinRepository.save(medecin);
        return medecinMapper.toReponse(medecin);
    }

    @Override
    public void Delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("l'id est nul");
        }
        Medecin medecin = medecinRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
        medecinRepository.deleteById(id);
    }

    @Override
    public List<MedecinDtoReponse> GetAllMedecin() {
        List<Medecin> medecinList = medecinRepository.findAllByOrderByNomAscPrenomAsc();
        return medecinMapper.toReponseList(medecinList);
    }

    @Override
    public List<ConsultationDtoReponse> consulterHistorique(Long id) {
        List<Consultation> consultationList = consultationRepository.findByMedecinId(id);
        return consultationMapper.toReponseList(consultationList);
    }

    @Override
    public RendezVousDtoReponse ajouterRendezVous(RendezVousDtoRequest rendezVousDtoRequest) {
        if (rendezVousDtoRequest.disponibiliteId() == null) {
            throw new IllegalArgumentException("l'id de la disponibilite est nul");
        }

        Disponibilite disponibilite = disponibiliteRepository.findById(rendezVousDtoRequest.disponibiliteId())
                .orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));

        if (!disponibilite.isActif()) {
            throw new RuntimeException("Cette disponibilité est désactivée par le médecin.");
        }

        // Booking by availability is unlimited: a slot can accept any number of patients.
        Time reservationStart = rendezVousDtoRequest.heure();
        Time reservationEnd = rendezVousDtoRequest.heureFin();

        Time dispoStart = disponibilite.getHeureDebut();
        Time dispoEnd = disponibilite.getHeureFin();

        if (reservationStart == null) {
            reservationStart = dispoStart;
            reservationEnd = addMinutes(reservationStart, 30);
        } else {
            if (reservationEnd == null) {
                reservationEnd = addMinutes(reservationStart, 30);
            }
        }

        if (!reservationEnd.after(reservationStart)) {
            throw new IllegalArgumentException("heure de fin invalide pour le rendez-vous");
        }

        if (reservationStart.before(dispoStart) || reservationEnd.after(dispoEnd)) {
            throw new IllegalArgumentException("Le rendez-vous doit être dans le créneau disponible.");
        }

        // keep the disponibilite as-is and link the rendez-vous to it
        Disponibilite reservedDisponibilite = disponibilite;

        RendezVous rendezVous = rendezVousMapper.toEntity(rendezVousDtoRequest);
        // ensure medecin and patient are set on the entity in case mapper didn't set them
        if (rendezVous.getMedecin() == null && rendezVousDtoRequest.medecinId() != null) {
            Medecin m = medecinRepository.findById(rendezVousDtoRequest.medecinId()).orElse(null);
            rendezVous.setMedecin(m);
        }
        if (rendezVous.getPatient() == null && rendezVousDtoRequest.patientId() != null) {
            Patient p = patientRepository.findById(rendezVousDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("erreur patient non trouve"));
            rendezVous.setPatient(p);
        }

        rendezVous.setHeure(reservationStart);
        // optionally set heureFin if entity has field (no setter shown) - skip if not present
        rendezVous.setStatut(Statut.En_ATTENTE);
        rendezVous.setDisponibilite(reservedDisponibilite);

        RendezVous rendezVousSauvegarde = rendezVousRepository.save(rendezVous);
        return rendezVousMapper.toReponse(rendezVousSauvegarde);
    }

    private Time addMinutes(Time time, int minutes) {
        return Time.valueOf(time.toLocalTime().plusMinutes(minutes));
    }
    @Override
    public List<MedecinDtoReponse> GetMedecinsBySpecialite(Long specialiteId) {
        List<Medecin> medecinList = medecinRepository.findBySpecialiteIdOrderByNomAscPrenomAsc(specialiteId);
        return medecinMapper.toReponseList(medecinList);
    }
}
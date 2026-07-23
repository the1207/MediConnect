package com.Mediconnect.Service.implementation;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Repositories.ConsultationRepository;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.RendezVousRepository;
import com.Mediconnect.Repositories.SpecialiteRepository;
import com.Mediconnect.enumeration.Statut;
import com.Mediconnect.mapper.ConsultationMapper;
import com.Mediconnect.mapper.RendezVousMapper;
import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.MedecinDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedecinDtoRequest;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Service.MedecinService;
import com.Mediconnect.mapper.MedecinMapper;

@Service
public class MedecinImplementation implements MedecinService {
    private final MedecinRepository medecinRepository;
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
                                 RendezVousMapper rendezVousMapper, DisponibiliteRepository disponibiliteRepository) {
        this.medecinRepository = medecinRepository;
        this.medecinMapper = medecinMapper;
        this.consultationRepository = consultationRepository;
        this.consultationMapper = consultationMapper;
        this.specialiteRepository = specialiteRepository;
        this.rendezVousRepository = rendezVousRepository;
        this.rendezVousMapper = rendezVousMapper;
        this.disponibiliteRepository = disponibiliteRepository;
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
        List<Medecin> medecinList = medecinRepository.findAll();
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

        if (Boolean.TRUE.equals(disponibilite.getReservation())) {
            throw new RuntimeException("cette disponibilite est deja reservee");
        }

        RendezVous rendezVous = rendezVousMapper.toEntity(rendezVousDtoRequest);

        rendezVous.setStatut(Statut.En_ATTENTE);

        RendezVous rendezVousSauvegarde = rendezVousRepository.save(rendezVous);
        disponibilite.setReservation(true);
        disponibiliteRepository.save(disponibilite);

        return rendezVousMapper.toReponse(rendezVousSauvegarde);
    }
}
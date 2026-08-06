package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.RendezVousRepository;
import com.Mediconnect.Service.RendezVousService;
import com.Mediconnect.enumeration.Statut;
import com.Mediconnect.mapper.RendezVousMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RendezVousImplementation implements RendezVousService {
    private final RendezVousRepository rendezVousRepository;
    private final RendezVousMapper rendezVousMapper;
    private final DisponibiliteRepository disponibiliteRepository;

    public RendezVousImplementation(RendezVousRepository rendezVousRepository, RendezVousMapper rendezVousMapper, DisponibiliteRepository disponibiliteRepository) {
        this.rendezVousRepository = rendezVousRepository;
        this.rendezVousMapper = rendezVousMapper;
        this.disponibiliteRepository = disponibiliteRepository;
    }


    @Override
    public List<RendezVousDtoReponse> GetAllRendezVous(Long id) {
        List<RendezVous> rendezVousList = rendezVousRepository.findByPatientId(id);
        return rendezVousMapper.toReponseList(rendezVousList);
    }

    @Override
    public RendezVousDtoReponse GetRendezVous(Long id){
        RendezVous rendezVous = rendezVousRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur RendezVous non trouve"));
        return rendezVousMapper.toReponse(rendezVous);
    }

    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        RendezVous rendezVous = rendezVousRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur RendezVous non trouve"));

        if (rendezVous.getDisponibilite() != null) {
            Disponibilite disponibilite = rendezVous.getDisponibilite();
            disponibilite.setReservation(false);
            disponibiliteRepository.save(disponibilite);
        }

        rendezVousRepository.deleteById(id);
    }

    @Override
    public void Confirmer(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id).orElseThrow(() -> new RuntimeException("rendez-vous non trouve"));
        if (rendezVous.getStatut() != Statut.En_ATTENTE) {
            throw new RuntimeException("seul un rendez-vous en attente peut etre confirme");
        }

        rendezVous.setStatut(Statut.EN_COURS);
        rendezVousRepository.save(rendezVous);
    }

    @Override
    public void Refuser(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id).orElseThrow(() -> new RuntimeException("rendez-vous non trouve"));
        if(rendezVous.getStatut() != Statut.En_ATTENTE){
            throw new RuntimeException("rendez-vous deja accepter");
        }
        rendezVous.setStatut(Statut.REFUSEE);
        rendezVousRepository.save(rendezVous);

        if(rendezVous.getDisponibilite() != null){
            Disponibilite disponibilite = rendezVous.getDisponibilite();
            disponibilite.setReservation(false);
            disponibiliteRepository.save(disponibilite);
        }
    }
    @Override
    public List<RendezVousDtoReponse> GetByMedecin(Long medecinId) {
        List<RendezVous> rendezVousList = rendezVousRepository.findByMedecinId(medecinId);
        return rendezVousMapper.toReponseList(rendezVousList);
    }
}
package com.Mediconnect.Service.implementation;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Service.DisponibiliteService;
import com.Mediconnect.mapper.DisponibiliteMapper;
@Service
public class DisponibiliteImplementation implements DisponibiliteService {
    private final DisponibiliteRepository disponibiliteRepository;
    private final DisponibiliteMapper disponibiliteMapper;
    private final MedecinRepository medecinRepository;

    public DisponibiliteImplementation(DisponibiliteRepository disponibiliteRepository,DisponibiliteMapper disponibiliteMapper, MedecinRepository medecinRepository) {
        this.disponibiliteRepository = disponibiliteRepository;
        this.disponibiliteMapper = disponibiliteMapper;
        this.medecinRepository = medecinRepository;
    }
    @Override
    public DisponibiliteDtoReponse Create(DisponibiliteDtoRequest disponibiliteDtoRequest){
        Disponibilite disponibilite = disponibiliteMapper.toEntity(disponibiliteDtoRequest);
        Disponibilite disponibilite1 = disponibiliteRepository.save(disponibilite);
        return disponibiliteMapper.toReponse(disponibilite1);
    }
    @Override
    public DisponibiliteDtoReponse GetDisponibilite(Long id){
        Disponibilite disponibilite = disponibiliteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));
        return disponibiliteMapper.toReponse(disponibilite);
    }
    @Override
    public DisponibiliteDtoReponse Update(Long id,DisponibiliteDtoRequest disponibiliteDtoRequest){
        Disponibilite disponibilite = disponibiliteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));

        if (disponibiliteDtoRequest.dateCreneau() != null && !disponibiliteDtoRequest.dateCreneau().isBlank()) {
            disponibilite.setDateCreneau(Date.valueOf(disponibiliteDtoRequest.dateCreneau()));
        }

        if (disponibiliteDtoRequest.heureDebut() != null && !disponibiliteDtoRequest.heureDebut().isBlank()) {
            disponibilite.setHeureDebut(Time.valueOf(formatTime(disponibiliteDtoRequest.heureDebut())));
        }

        if (disponibiliteDtoRequest.heureFin() != null && !disponibiliteDtoRequest.heureFin().isBlank()) {
            disponibilite.setHeureFin(Time.valueOf(formatTime(disponibiliteDtoRequest.heureFin())));
        }

        if (disponibiliteDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(disponibiliteDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            disponibilite.setMedecin(medecin);
        }

        disponibiliteRepository.save(disponibilite);
        return disponibiliteMapper.toReponse(disponibilite);
    }

    private String formatTime(String timeValue) {
        return timeValue.length() == 5 ? timeValue + ":00" : timeValue;
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        if (!disponibiliteRepository.existsById(id)) {
            throw new RuntimeException("erreur disponibilite non trouve");
        }
        disponibiliteRepository.deleteById(id);
    }
    @Override
    public List<DisponibiliteDtoReponse> GetAllDisponibilite(){
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        return disponibiliteMapper.toReponseList(disponibiliteList);
    }

    @Override
    public void liberer(Long id) {
        Disponibilite disponibilite = disponibiliteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));
        if (Boolean.FALSE.equals(disponibilite.getReservation())) {
            throw new RuntimeException("cette disponibilite n'est pas reservee");
        }
        disponibilite.setReservation(false);
        disponibiliteRepository.save(disponibilite);
    }

    @Override
    public void reserver(Long id) {
        Disponibilite disponibilite = disponibiliteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));
        if (Boolean.TRUE.equals(disponibilite.getReservation())) {
            throw new RuntimeException("cette disponibilite est deja reservee");
        }
        disponibilite.setReservation(true);
        disponibiliteRepository.save(disponibilite);
    }

    @Override
    public void toggleActif(Long id, boolean actif) {
        Disponibilite disponibilite = disponibiliteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("erreur disponibilite non trouve"));
        disponibilite.setActif(actif);
        disponibiliteRepository.save(disponibilite);
    }

    @Override
    public List<DisponibiliteDtoReponse> GetByMedecin(Long medecinId) {
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findByMedecinIdOrderByDateCreneauAscHeureDebutAsc(medecinId);
        return disponibiliteMapper.toReponseList(disponibiliteList);
    }
}
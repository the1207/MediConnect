package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Repositories.DisponibiliteRepository;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Service.DisponibiliteService;
import com.Mediconnect.mapper.DisponibiliteMapper;
import org.springframework.stereotype.Service;

import java.util.List;
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
        disponibilite.setDateCreneau(disponibiliteDtoRequest.dateCreneau());
        disponibilite.setHeureDebut(disponibiliteDtoRequest.heureDebut());
        disponibilite.setHeureFin(disponibiliteDtoRequest.heureFin());

        if (disponibiliteDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(disponibiliteDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            disponibilite.setMedecin(medecin);
        }

        disponibiliteRepository.save(disponibilite);
        return disponibiliteMapper.toReponse(disponibilite);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        Disponibilite disponibilite = disponibiliteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur disponiblite non trouve"));
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
}
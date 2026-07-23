package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Repositories.MedecinRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DisponibiliteMapper {
    private final MedecinRepository medecinRepository;

    public DisponibiliteMapper(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    public Disponibilite toEntity(DisponibiliteDtoRequest disponibiliteDtoRequest){
        Disponibilite disponibilite = new Disponibilite();
        disponibilite.setDateCreneau(disponibiliteDtoRequest.dateCreneau());
        disponibilite.setHeureDebut(disponibiliteDtoRequest.heureDebut());
        disponibilite.setHeureFin(disponibiliteDtoRequest.heureFin());

        if (disponibiliteDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(disponibiliteDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            disponibilite.setMedecin(medecin);
        }

        return disponibilite;
    }

    public DisponibiliteDtoReponse toReponse(Disponibilite disponibilite){
        return new DisponibiliteDtoReponse(
                disponibilite.getDateCreneau(),
                disponibilite.getHeureDebut(),
                disponibilite.getHeureFin(),
                disponibilite.getMedecin() != null ? disponibilite.getMedecin().getId() : null
        );
    }

    public List<DisponibiliteDtoReponse> toReponseList(List<Disponibilite> disponibiliteList){
        return disponibiliteList.stream().map(this::toReponse).toList();
    }
}
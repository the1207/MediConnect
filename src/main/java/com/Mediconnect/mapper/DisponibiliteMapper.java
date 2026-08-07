package com.Mediconnect.mapper;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import org.springframework.stereotype.Component;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;
import com.Mediconnect.Entities.Disponibilite;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Repositories.MedecinRepository;

@Component
public class DisponibiliteMapper {
    private final MedecinRepository medecinRepository;

    public DisponibiliteMapper(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    public Disponibilite toEntity(DisponibiliteDtoRequest disponibiliteDtoRequest){
        Disponibilite disponibilite = new Disponibilite();

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

        return disponibilite;
    }

    private String formatTime(String timeValue) {
        return timeValue.length() == 5 ? timeValue + ":00" : timeValue;
    }

    public DisponibiliteDtoReponse toReponse(Disponibilite disponibilite){
        return new DisponibiliteDtoReponse(
                disponibilite.getId(),
                disponibilite.getDateCreneau(),
                disponibilite.getHeureDebut(),
                disponibilite.getHeureFin(),
                disponibilite.getMedecin() != null ? disponibilite.getMedecin().getId() : null,
                disponibilite.getReservation()
        );
    }

    public List<DisponibiliteDtoReponse> toReponseList(List<Disponibilite> disponibiliteList){
        return disponibiliteList.stream().map(this::toReponse).toList();
    }
}
package com.Mediconnect.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoReponse.MedecinDtoReponse;
import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedecinDtoRequest;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Repositories.SpecialiteRepository;

@Component
public class MedecinMapper {
    private final DisponibiliteMapper disponibiliteMapper;
    private final ConsultationMapper consultationMapper;
    private final ConstanteMapper constanteMapper;
    private final RendezVousMapper rendezVousMapper;
    private final SpecialiteRepository specialiteRepository;
    private final SpecialiteMapper specialiteMapper;

    public MedecinMapper(DisponibiliteMapper disponibiliteMapper, ConsultationMapper consultationMapper,
                         ConstanteMapper constanteMapper, RendezVousMapper rendezVousMapper,
                         SpecialiteRepository specialiteRepository, SpecialiteMapper specialiteMapper) {
        this.disponibiliteMapper = disponibiliteMapper;
        this.consultationMapper = consultationMapper;
        this.constanteMapper = constanteMapper;
        this.rendezVousMapper = rendezVousMapper;
        this.specialiteRepository = specialiteRepository;
        this.specialiteMapper = specialiteMapper;
    }

    public Medecin toEntity(MedecinDtoRequest medecinDtoRequest) {
        Medecin medecin = new Medecin();
        medecin.setNom(medecinDtoRequest.nom());
        medecin.setPrenom(medecinDtoRequest.prenom());

        if (medecinDtoRequest.specialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(medecinDtoRequest.specialiteId())
                    .orElseThrow(() -> new RuntimeException("erreur specialite non trouve"));
            medecin.setSpecialite(specialite);
        }

        return medecin;
    }

    public MedecinDtoReponse toReponse(Medecin medecin) {
        List<DisponibiliteDtoReponse> disponibilites;
        if (medecin.getDisponibilites() != null) {
            disponibilites = disponibiliteMapper.toReponseList(medecin.getDisponibilites());
        } else {
            disponibilites = List.<DisponibiliteDtoReponse>of();
        }

        List<ConsultationDtoReponse> consultations;
        if (medecin.getConsultations() != null) {
            consultations = consultationMapper.toReponseList(medecin.getConsultations());
        } else {
            consultations = List.<ConsultationDtoReponse>of();
        }

        List<ConstanteDtoReponse> constantes;
        if (medecin.getConstantes() != null) {
            constantes = constanteMapper.toReponseList(medecin.getConstantes());
        } else {
            constantes = List.<ConstanteDtoReponse>of();
        }

        List<RendezVousDtoReponse> rendezVous;
        if (medecin.getRendezVous() != null) {
            rendezVous = rendezVousMapper.toReponseList(medecin.getRendezVous());
        } else {
            rendezVous = List.<RendezVousDtoReponse>of();
        }

        return new MedecinDtoReponse(
                medecin.getId(),
                medecin.getNom(),
                medecin.getPrenom(),
                medecin.getSpecialite() != null ? specialiteMapper.toReponse(medecin.getSpecialite()) : null,
                disponibilites,
                consultations,
                constantes,
                rendezVous
        );
    }

    public List<MedecinDtoReponse> toReponseList(List<Medecin> medecinList) {
        return medecinList.stream().map(this::toReponse).toList();
    }
}
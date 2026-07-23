package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedicamentDtoRequest;
import com.Mediconnect.Entities.Medicament;
import com.Mediconnect.Entities.Ordonnance;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MedicamentMapper {
    private final OrdonnanceRepository ordonnanceRepository;

    public MedicamentMapper(OrdonnanceRepository ordonnanceRepository) {
        this.ordonnanceRepository = ordonnanceRepository;
    }

    public Medicament toEntity(MedicamentDtoRequest medicamentDtoRequest){
        Medicament medicament = new Medicament();
        medicament.setNom(medicamentDtoRequest.nom());
        medicament.setRegle(medicamentDtoRequest.regle());
        medicament.setDureeTraitement(medicamentDtoRequest.dureeTraitement());

        if (medicamentDtoRequest.ordonnanceId() != null) {
            Ordonnance ordonnance = ordonnanceRepository.findById(medicamentDtoRequest.ordonnanceId())
                    .orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
            medicament.setOrdonnance(ordonnance);
        }

        return medicament;
    }

    public MedicamentDtoReponse toReponses(Medicament medicament){
        return new MedicamentDtoReponse(
                medicament.getNom(),
                medicament.getRegle(),
                medicament.getDureeTraitement(),
                medicament.getOrdonnance() != null ? medicament.getOrdonnance().getId() : null
        );
    }

    public List<MedicamentDtoReponse> toReponseList(List<Medicament> medicamentList){
        return medicamentList.stream().map(this::toReponses).toList();
    }
}
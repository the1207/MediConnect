package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;
import com.Mediconnect.Entities.Ordonnance;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrdonnanceMapper {
    private final MedicamentMapper medicamentMapper;

    public OrdonnanceMapper(MedicamentMapper medicamentMapper) {
        this.medicamentMapper = medicamentMapper;
    }

    public Ordonnance toEntity(OrdonnanceDtoRequest ordonnanceDtoRequest){
        Ordonnance ordonnance = new Ordonnance();
        ordonnance.setCommentaire(ordonnanceDtoRequest.commentaire());
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
                ordonnance.getDateCreation(),
                ordonnance.getCommentaire(),
                medicaments
        );
    }

    public List<OrdonnanceDtoReponse> toReponseList(List<Ordonnance> ordonnanceList){
        return ordonnanceList.stream().map(this::toReponse).toList();
    }
}
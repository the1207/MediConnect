package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Entities.Specialite;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SpecialiteMapper {
    public Specialite toEntity(SpecialiteDtoRequest specialiteDtoRequest){
        Specialite specialite = new Specialite();
        specialite.setNom(specialiteDtoRequest.nom());
        return specialite;
    }

    public SpecialiteDtoReponse toReponse(Specialite specialite){
        return new SpecialiteDtoReponse(
                specialite.getId(),
                specialite.getNom()
        );
    }

    public List<SpecialiteDtoReponse> toReponseList(List<Specialite> specialiteList){
        return specialiteList.stream().map(this::toReponse).toList();
    }
}
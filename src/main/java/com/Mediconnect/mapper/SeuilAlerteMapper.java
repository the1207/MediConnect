package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.SeuilAlerteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SeuilAlerteDtoRequest;
import com.Mediconnect.Entities.SeuilAlerte;
import org.springframework.stereotype.Component;

@Component
public class SeuilAlerteMapper {

    public SeuilAlerte toEntity(SeuilAlerteDtoRequest dto) {
        SeuilAlerte entity = new SeuilAlerte();
        entity.setTypeConstante(dto.getTypeConstante());
        entity.setValeurMin(dto.getValeurMin());
        entity.setValeurMax(dto.getValeurMax());
        return entity;
    }

    public SeuilAlerteDtoReponse toDto(SeuilAlerte entity) {
        return new SeuilAlerteDtoReponse(
                entity.getId(),
                entity.getTypeConstante(),
                entity.getValeurMin(),
                entity.getValeurMax()
        );
    }
}

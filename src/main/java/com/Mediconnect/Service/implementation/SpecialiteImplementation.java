package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Repositories.SpecialiteRepository;
import com.Mediconnect.Service.SpecialiteService;
import com.Mediconnect.mapper.SpecialiteMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialiteImplementation implements SpecialiteService {
    private final SpecialiteRepository specialiteRepository;
    private final SpecialiteMapper specialiteMapper;

    public SpecialiteImplementation(SpecialiteRepository specialiteRepository, SpecialiteMapper specialiteMapper) {
        this.specialiteRepository = specialiteRepository;
        this.specialiteMapper = specialiteMapper;
    }

    @Override
    public SpecialiteDtoReponse Create(SpecialiteDtoRequest specialiteDtoRequest) {
        Specialite specialite = specialiteMapper.toEntity(specialiteDtoRequest);
        Specialite specialiteSauvegardee = specialiteRepository.save(specialite);
        return specialiteMapper.toReponse(specialiteSauvegardee);
    }

        @Override
    public List<SpecialiteDtoReponse> GetAllSpecialite() {
        List<Specialite> specialiteList = specialiteRepository.findAll();
        return specialiteMapper.toReponseList(specialiteList);
    }
}
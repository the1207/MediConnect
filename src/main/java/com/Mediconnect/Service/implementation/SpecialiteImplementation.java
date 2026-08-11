package com.Mediconnect.Service.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Repositories.SpecialiteRepository;
import com.Mediconnect.Service.SpecialiteService;
import com.Mediconnect.mapper.SpecialiteMapper;

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
    public SpecialiteDtoReponse Update(Long id, SpecialiteDtoRequest specialiteDtoRequest) {
        Specialite specialite = specialiteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Spécialité introuvable"));
        specialite.setNom(specialiteDtoRequest.nom());
        Specialite updated = specialiteRepository.save(specialite);
        return specialiteMapper.toReponse(updated);
    }

    @Override
    public void Delete(Long id) {
        if (!specialiteRepository.existsById(id)) {
            throw new IllegalArgumentException("Spécialité introuvable");
        }
        specialiteRepository.deleteById(id);
    }

    @Override
    public List<SpecialiteDtoReponse> GetAllSpecialite() {
        List<Specialite> specialiteList = specialiteRepository.findAll();
        return specialiteMapper.toReponseList(specialiteList);
    }
}
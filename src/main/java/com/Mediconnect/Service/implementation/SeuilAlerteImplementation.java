package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.SeuilAlerteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SeuilAlerteDtoRequest;
import com.Mediconnect.Entities.SeuilAlerte;
import com.Mediconnect.Repositories.SeuilAlerteRepository;
import com.Mediconnect.Service.SeuilAlerteService;
import com.Mediconnect.enumeration.TypeConstante;
import com.Mediconnect.mapper.SeuilAlerteMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeuilAlerteImplementation implements SeuilAlerteService {

    private final SeuilAlerteRepository seuilAlerteRepository;
    private final SeuilAlerteMapper seuilAlerteMapper;

    public SeuilAlerteImplementation(SeuilAlerteRepository seuilAlerteRepository, SeuilAlerteMapper seuilAlerteMapper) {
        this.seuilAlerteRepository = seuilAlerteRepository;
        this.seuilAlerteMapper = seuilAlerteMapper;
    }

    @Override
    public SeuilAlerteDtoReponse create(SeuilAlerteDtoRequest dto) {
        SeuilAlerte entity = seuilAlerteMapper.toEntity(dto);
        SeuilAlerte saved = seuilAlerteRepository.save(entity);
        return seuilAlerteMapper.toDto(saved);
    }

    @Override
    public SeuilAlerteDtoReponse update(Long id, SeuilAlerteDtoRequest dto) {
        SeuilAlerte entity = seuilAlerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SeuilAlerte non trouvé"));
        entity.setTypeConstante(dto.getTypeConstante());
        entity.setValeurMin(dto.getValeurMin());
        entity.setValeurMax(dto.getValeurMax());
        SeuilAlerte saved = seuilAlerteRepository.save(entity);
        return seuilAlerteMapper.toDto(saved);
    }

    @Override
    public void delete(Long id) {
        seuilAlerteRepository.deleteById(id);
    }

    @Override
    public SeuilAlerteDtoReponse getById(Long id) {
        SeuilAlerte entity = seuilAlerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SeuilAlerte non trouvé"));
        return seuilAlerteMapper.toDto(entity);
    }

    @Override
    public SeuilAlerteDtoReponse getByType(TypeConstante type) {
        SeuilAlerte entity = seuilAlerteRepository.findByTypeConstante(type)
                .orElseThrow(() -> new RuntimeException("SeuilAlerte non trouvé pour ce type"));
        return seuilAlerteMapper.toDto(entity);
    }

    @Override
    public List<SeuilAlerteDtoReponse> getAll() {
        return seuilAlerteRepository.findAll().stream()
                .map(seuilAlerteMapper::toDto)
                .toList();
    }

    @Override
    public boolean isAlerteTemperature(Double temperature) {
        Optional<SeuilAlerte> seuil = seuilAlerteRepository.findByTypeConstante(TypeConstante.TEMPERATURE);
        if (seuil.isEmpty()) return false;
        SeuilAlerte s = seuil.get();
        return temperature < s.getValeurMin() || temperature > s.getValeurMax();
    }

    @Override
    public boolean isAlertePoids(Double poids) {
        Optional<SeuilAlerte> seuil = seuilAlerteRepository.findByTypeConstante(TypeConstante.POIDS);
        if (seuil.isEmpty()) return false;
        SeuilAlerte s = seuil.get();
        return poids < s.getValeurMin() || poids > s.getValeurMax();
    }

    @Override
    public boolean isAlerteTension(String tension) {
        Optional<SeuilAlerte> seuil = seuilAlerteRepository.findByTypeConstante(TypeConstante.TENSION_ARTERIELLE);
        if (seuil.isEmpty()) return false;
        SeuilAlerte s = seuil.get();
        try {
            String[] parts = tension.split("/");
            if (parts.length != 2) return false;
            double systolique = Double.parseDouble(parts[0].trim());
            double diastolique = Double.parseDouble(parts[1].trim());
            return systolique < s.getValeurMin() || systolique > s.getValeurMax()
                || diastolique < 60 || diastolique > 90;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}

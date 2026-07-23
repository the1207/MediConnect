package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConstanteDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Repositories.ConstanteRepository;
import com.Mediconnect.Service.ConstanteService;
import com.Mediconnect.mapper.ConstanteMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConstanteImplementation implements ConstanteService {
    private final ConstanteRepository constanteRepository;
    private final ConstanteMapper constanteMapper;
    public ConstanteImplementation(ConstanteRepository constanteRepository,ConstanteMapper constanteMapper) {
        this.constanteRepository = constanteRepository;
        this.constanteMapper = constanteMapper;
    }
    @Override
    public ConstanteDtoReponse Create(ConstanteDtoRequest constanteDtoRequest){
        Constante constante = constanteMapper.toEntity(constanteDtoRequest);
        Constante constante1 = constanteRepository.save(constante);
        return constanteMapper.toReponses(constante1);
    }
    @Override
    public ConstanteDtoReponse GetConstante(Long id){
        Constante constante = constanteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur constante non trouve"));
        return constanteMapper.toReponses(constante);
    }
    @Override
    public ConstanteDtoReponse Update(Long id, ConstanteDtoRequest constanteDtoRequest){
        Constante constante = constanteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur constante non trouve"));
        constante.setTemperature(constanteDtoRequest.temperature());
        constante.setPoids(constanteDtoRequest.poids());
        constante.setTensionArteriel(constanteDtoRequest.tensionArteriel());
        constanteRepository.save(constante);
        return constanteMapper.toReponses(constante);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        Constante constante = constanteRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur constante non trouve"));
        constanteRepository.deleteById(id);
    }
    @Override
    public List<ConstanteDtoReponse> GetAllConstante(){
        List<Constante> constanteList = constanteRepository.findAll();
        return constanteMapper.toReponseList(constanteList);
    }

    @Override
    public List<ConstanteDtoReponse> GetConstanteByPatient(Long patientId){
        List<Constante> constanteList = constanteRepository.findByPatientId(patientId);
        return constanteMapper.toReponseList(constanteList);
    }
}
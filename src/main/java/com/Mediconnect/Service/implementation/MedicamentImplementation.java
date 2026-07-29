package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedicamentDtoRequest;
import com.Mediconnect.Entities.Medicament;
import com.Mediconnect.Entities.Ordonnance;
import com.Mediconnect.Repositories.MedicamentRepository;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import com.Mediconnect.Service.MedicamentService;
import com.Mediconnect.mapper.MedicamentMapper;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class MedicamentImplementation implements MedicamentService {
    private final MedicamentRepository medicamentRepository;
    private final MedicamentMapper medicamentMapper;
    private final OrdonnanceRepository ordonnanceRepository;
    public MedicamentImplementation(MedicamentRepository medicamentRepository, MedicamentMapper medicamentMapper, OrdonnanceRepository ordonnanceRepository) {
        this.medicamentRepository = medicamentRepository;
        this.medicamentMapper = medicamentMapper;
        this.ordonnanceRepository = ordonnanceRepository;
    }
    @Override
    public MedicamentDtoReponse Create(MedicamentDtoRequest medicamentDtoRequest){
        Medicament medicament = medicamentMapper.toEntity(medicamentDtoRequest);
        Medicament medicament1 = medicamentRepository.save(medicament);
        return medicamentMapper.toReponses(medicament1);
    }
    @Override
    public MedicamentDtoReponse GetMedicament(Long id){
        Medicament medicament = medicamentRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medicament non trouve"));
        return medicamentMapper.toReponses(medicament);
    }
    @Override
    public MedicamentDtoReponse Update(Long id, MedicamentDtoRequest medicamentDtoRequest){
        Medicament medicament = medicamentRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medicament non trouve"));
        medicament.setNom(medicamentDtoRequest.nom());
        medicament.setPosologie(medicamentDtoRequest.posologie());

        if (medicamentDtoRequest.ordonnanceId() != null) {
            Ordonnance ordonnance = ordonnanceRepository.findById(medicamentDtoRequest.ordonnanceId())
                    .orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
            medicament.setOrdonnance(ordonnance);
        }

        medicamentRepository.save(medicament);
        return medicamentMapper.toReponses(medicament);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        Medicament medicament = medicamentRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur medicament non trouve"));
        medicamentRepository.deleteById(id);
    }
    @Override
    public List<MedicamentDtoReponse> GetAllMedicament(){
        List<Medicament> medicamentList = medicamentRepository.findAll();
        return medicamentMapper.toReponseList(medicamentList);
    }

    @Override
    public List<MedicamentDtoReponse> GetMedicamentByOrdonnance(Long ordonnanceId){
        List<Medicament> medicamentList = medicamentRepository.findByOrdonnanceId(ordonnanceId);
        return medicamentMapper.toReponseList(medicamentList);
    }

    @Override
    public List<MedicamentDtoReponse> GetMedicamentByPatient(Long patientId){
        List<Medicament> medicamentList = medicamentRepository.findByPatientId(patientId);
        return medicamentMapper.toReponseList(medicamentList);
    }

    @Override
    public List<MedicamentDtoReponse> GetMedicamentByMedecin(Long medecinId){
        List<Medicament> medicamentList = medicamentRepository.findByMedecinId(medecinId);
        return medicamentMapper.toReponseList(medicamentList);
    }
}
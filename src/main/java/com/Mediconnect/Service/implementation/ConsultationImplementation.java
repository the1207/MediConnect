package com.Mediconnect.Service.implementation;

import java.time.LocalDateTime;
import java.util.List;

import com.Mediconnect.Entities.Ordonnance;
import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConsultationDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Repositories.ConsultationRepository;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import com.Mediconnect.Service.ConsultationService;
import com.Mediconnect.mapper.ConsultationMapper;
@Service
public class ConsultationImplementation implements ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final OrdonnanceRepository ordonnanceRepository;
    private final ConsultationMapper consultationMapper;
    public ConsultationImplementation(ConsultationRepository consultationRepository, OrdonnanceRepository ordonnanceRepository, ConsultationMapper consultationMapper) {
        this.consultationRepository = consultationRepository;
        this.ordonnanceRepository = ordonnanceRepository;
        this.consultationMapper = consultationMapper;
    }
    @Override
    public ConsultationDtoReponse Create(ConsultationDtoRequest consultationDtoRequest){
        Consultation consultation = consultationMapper.toEntity(consultationDtoRequest);
        consultation.setDateDebut(LocalDateTime.now());
        consultation.setDateFin(LocalDateTime.now());
        Consultation consultation1 = consultationRepository.save(consultation);
        return consultationMapper.toReponse(consultation1);
    }
    @Override
    public ConsultationDtoReponse GetConsultation(Long id){
        Consultation consultation = consultationRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur consultation non trouve"));
        return consultationMapper.toReponse(consultation);
    }
    @Override
    public ConsultationDtoReponse Update(Long id, ConsultationDtoRequest consultationDtoRequest){
        Consultation consultation = consultationRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur consultation non trouve"));
        consultation.setMotif(consultationDtoRequest.motif());
        consultation.setActionsRequis(consultationDtoRequest.actionsRequis());
        if (consultationDtoRequest.ordonnanceId() != null) {
            Ordonnance ordonnance = ordonnanceRepository.findById(consultationDtoRequest.ordonnanceId())
                    .orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
            consultation.setOrdonnance(ordonnance);
        }
        consultationRepository.save(consultation);
        return consultationMapper.toReponse(consultation);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        Consultation consultation = consultationRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur consultation non trouve"));
        consultationRepository.deleteById(id);
    }
    @Override
    public List<ConsultationDtoReponse> GetAllConsultation(){
        List<Consultation> consultationList = consultationRepository.findAll();
        return consultationMapper.toReponseList(consultationList);
    }
}

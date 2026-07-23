package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Entities.Medicament;
import com.Mediconnect.Entities.Ordonnance;
import com.Mediconnect.Repositories.ConsultationRepository;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import com.Mediconnect.Service.OrdonnanceService;
import com.Mediconnect.mapper.OrdonnanceMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class OrdonnanceImplementation implements OrdonnanceService {
    private final OrdonnanceRepository ordonnanceRepository;
    private final OrdonnanceMapper ordonnanceMapper;
    private final ConsultationRepository consultationRepository;
    public OrdonnanceImplementation(OrdonnanceRepository ordonnanceRepository, OrdonnanceMapper ordonnanceMapper,ConsultationRepository consultationRepository) {
        this.ordonnanceRepository = ordonnanceRepository;
        this.ordonnanceMapper = ordonnanceMapper;
        this.consultationRepository = consultationRepository;
    }
    @Override
    public OrdonnanceDtoReponse Create(OrdonnanceDtoRequest ordonnanceDtoRequest){
        Ordonnance ordonnance = ordonnanceMapper.toEntity(ordonnanceDtoRequest);
        ordonnance.setDateCreation(LocalDateTime.now());
        Ordonnance ordonnance1 = ordonnanceRepository.save(ordonnance);

        if (ordonnanceDtoRequest.consultationId() != null) {
            Consultation consultation = consultationRepository.findById(ordonnanceDtoRequest.consultationId())
                    .orElseThrow(() -> new RuntimeException("erreur consultation non trouve"));
            consultation.setOrdonnance(ordonnance1);
            consultationRepository.save(consultation);
        }

        return ordonnanceMapper.toReponse(ordonnance1);
    }
    @Override
    public OrdonnanceDtoReponse GetOrdonnance(Long id){
        Ordonnance ordonnance = ordonnanceRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
        return ordonnanceMapper.toReponse(ordonnance);
    }
    @Override
    public OrdonnanceDtoReponse Update(Long id, OrdonnanceDtoRequest ordonnanceDtoRequest){
        Ordonnance ordonnance = ordonnanceRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
        ordonnance.setCommentaire(ordonnanceDtoRequest.commentaire());
        ordonnanceRepository.save(ordonnance);
        return ordonnanceMapper.toReponse(ordonnance);
    }
    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        Ordonnance ordonnance = ordonnanceRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
        ordonnanceRepository.deleteById(id);
    }
    @Override
    public List<OrdonnanceDtoReponse> GetAllOrdonnance(){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }

    @Override
    public String imprimer(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
        Consultation consultationActuelle = consultationRepository.findByOrdonnanceId(id)
                .orElseThrow(() -> new RuntimeException("erreur consultation non trouve pour cette ordonnance"));
        Long patientId = consultationActuelle.getPatient().getId();

        List<Consultation> historiqueConsultations = consultationRepository.findByPatientId(patientId);

        StringBuilder texte = new StringBuilder();
        texte.append("=== Historique des consultations ===\n");

        for (Consultation consultation : historiqueConsultations) {
            texte.append("Date : ").append(consultation.getDateDebut())
                    .append(" | Motif : ").append(consultation.getMotif())
                    .append(" | Actions requises : ").append(consultation.getActionsRequis())
                    .append("\n");
        }

        texte.append("\n=== Ordonnance ===\n");
        texte.append("Date : ").append(ordonnance.getDateCreation()).append("\n");
        texte.append("Commentaire : ").append(ordonnance.getCommentaire()).append("\n");
        texte.append("Medicaments :\n");

        if (ordonnance.getMedicament() != null) {
            for (Medicament medicament : ordonnance.getMedicament()) {
                texte.append("- ").append(medicament.getNom())
                        .append(" : ").append(medicament.getRegle()).append("\n");
            }
        }
        return texte.toString();
    }

    @Override
    public List<OrdonnanceDtoReponse> GetOrdonnanceByPatient(Long patientId){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findByPatientId(patientId);
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }

    @Override
    public List<OrdonnanceDtoReponse> GetOrdonnanceByMedecin(Long medecinId){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findByMedecinId(medecinId);
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }
}
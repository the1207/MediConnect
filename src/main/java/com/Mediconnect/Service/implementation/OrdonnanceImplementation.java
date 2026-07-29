package com.Mediconnect.Service.implementation;

import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;
import com.Mediconnect.Entities.Medicament;
import com.Mediconnect.Entities.Ordonnance;
import com.Mediconnect.Repositories.OrdonnanceRepository;
import com.Mediconnect.Service.OrdonnanceService;
import com.Mediconnect.enumeration.StatutOrdonnance;
import com.Mediconnect.mapper.OrdonnanceMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrdonnanceImplementation implements OrdonnanceService {
    private final OrdonnanceRepository ordonnanceRepository;
    private final OrdonnanceMapper ordonnanceMapper;

    public OrdonnanceImplementation(OrdonnanceRepository ordonnanceRepository, OrdonnanceMapper ordonnanceMapper) {
        this.ordonnanceRepository = ordonnanceRepository;
        this.ordonnanceMapper = ordonnanceMapper;
    }

    @Override
    public OrdonnanceDtoReponse Create(OrdonnanceDtoRequest ordonnanceDtoRequest){
        Ordonnance ordonnance = ordonnanceMapper.toEntity(ordonnanceDtoRequest);
        ordonnance.setDateCreation(LocalDateTime.now());
        if (ordonnance.getStatut() == null) {
            ordonnance.setStatut(StatutOrdonnance.REDIGEE);
        }
        Ordonnance ordonnance1 = ordonnanceRepository.save(ordonnance);
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
        if (ordonnanceDtoRequest.statut() != null) {
            ordonnance.setStatut(ordonnanceDtoRequest.statut());
        }
        ordonnanceRepository.save(ordonnance);
        return ordonnanceMapper.toReponse(ordonnance);
    }

    @Override
    public void Delete(Long id){
        if(id == null){
            throw new IllegalArgumentException("l'id est nul");
        }
        ordonnanceRepository.findById(id).orElseThrow(() -> new RuntimeException("erreur ordonnance non trouve"));
        ordonnanceRepository.deleteById(id);
    }

    @Override
    public List<OrdonnanceDtoReponse> GetAllOrdonnance(){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findAll();
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }

    @Override
    public OrdonnanceDtoReponse valider(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance non trouvee"));
        ordonnance.setStatut(StatutOrdonnance.VALIDEE);
        ordonnanceRepository.save(ordonnance);
        return ordonnanceMapper.toReponse(ordonnance);
    }

    @Override
    public OrdonnanceDtoReponse marquerImprimee(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance non trouvee"));
        ordonnance.setStatut(StatutOrdonnance.IMPRIMEE);
        ordonnanceRepository.save(ordonnance);
        return ordonnanceMapper.toReponse(ordonnance);
    }

    @Override
    public String imprimer(Long id) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance non trouvee"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        StringBuilder texte = new StringBuilder();

        texte.append("═══════════════════════════════════════════════════════════\n");
        texte.append("                        ORDONNANCE MEDICALE                 \n");
        texte.append("═══════════════════════════════════════════════════════════\n\n");

        if (ordonnance.getPatient() != null) {
            texte.append("Patient : ").append(ordonnance.getPatient().getPrenom())
                    .append(" ").append(ordonnance.getPatient().getNom()).append("\n");
        }

        if (ordonnance.getMedecin() != null) {
            texte.append("Médecin : Dr. ").append(ordonnance.getMedecin().getNom()).append("\n");
        }

        texte.append("Date : ").append(ordonnance.getDateCreation().format(formatter)).append("\n\n");

        texte.append("───────────────────────────────────────────────────────────\n");
        texte.append("                        PRESCRIPTION                        \n");
        texte.append("───────────────────────────────────────────────────────────\n\n");

        if (ordonnance.getMedicament() != null && !ordonnance.getMedicament().isEmpty()) {
            int index = 1;
            for (Medicament medicament : ordonnance.getMedicament()) {
                texte.append(index).append(". ").append(medicament.getNom()).append("\n");
                texte.append("   Posologie : ").append(medicament.getPosologie()).append("\n");
                texte.append("   Durée : ").append(medicament.getDureeTraitement()).append(" jours\n\n");
                index++;
            }
        }

        if (ordonnance.getCommentaire() != null && !ordonnance.getCommentaire().isEmpty()) {
            texte.append("───────────────────────────────────────────────────────────\n");
            texte.append("Observations : ").append(ordonnance.getCommentaire()).append("\n");
        }

        texte.append("\n═══════════════════════════════════════════════════════════\n");
        texte.append("                    Signature du médecin                    \n\n\n\n");
        texte.append("                    _______________________                  \n");
        texte.append("═══════════════════════════════════════════════════════════\n");

        return texte.toString();
    }

    @Override
    public List<OrdonnanceDtoReponse> GetOrdonnanceByPatient(Long patientId){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findByPatientIdOrderByDateCreationDesc(patientId);
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }

    @Override
    public List<OrdonnanceDtoReponse> GetOrdonnanceByMedecin(Long medecinId){
        List<Ordonnance> ordonnanceList = ordonnanceRepository.findByMedecinId(medecinId);
        return ordonnanceMapper.toReponseList(ordonnanceList);
    }
}

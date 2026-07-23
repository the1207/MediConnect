package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConstanteDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Entities.Medecin;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.PatientRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConstanteMapper {
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;

    // seuils definis pour le declenchement de l'alerte medicale
    private static final double TEMPERATURE_MIN = 35.0;
    private static final double TEMPERATURE_MAX = 38.0;
    private static final int TENSION_SYSTOLIQUE_MAX = 140;
    private static final int TENSION_DIASTOLIQUE_MAX = 90;

    public ConstanteMapper(PatientRepository patientRepository, MedecinRepository medecinRepository) {
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
    }

    public Constante toEntity(ConstanteDtoRequest constanteDtoRequest){
        Constante constante = new Constante();
        constante.setPoids(constanteDtoRequest.poids());
        constante.setTemperature(constanteDtoRequest.temperature());
        constante.setTensionArteriel(constanteDtoRequest.tensionArteriel());
        constante.setAlerte(calculerAlerte(constanteDtoRequest.temperature(), constanteDtoRequest.tensionArteriel()));

        if (constanteDtoRequest.patientId() != null) {
            Patient patient = patientRepository.findById(constanteDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("erreur patient non trouve"));
            constante.setPatient(patient);
        }

        if (constanteDtoRequest.medecinId() != null) {
            Medecin medecin = medecinRepository.findById(constanteDtoRequest.medecinId())
                    .orElseThrow(() -> new RuntimeException("erreur medecin non trouve"));
            constante.setMedecin(medecin);
        }

        return constante;
    }

    public ConstanteDtoReponse toReponses(Constante constante){
        return new ConstanteDtoReponse(
                constante.getTemperature(),
                constante.getPoids(),
                constante.getTensionArteriel(),
                constante.isAlerte(),
                constante.getPatient() != null ? constante.getPatient().getId() : null,
                constante.getMedecin() != null ? constante.getMedecin().getId() : null
        );
    }

    public List<ConstanteDtoReponse> toReponseList(List<Constante> constanteList){
        return constanteList.stream().map(this::toReponses).toList();
    }

    // determine si une constante depasse les seuils definis 
    private boolean calculerAlerte(Double temperature, String tensionArteriel) {
        boolean alerteTemperature = temperature != null
                && (temperature < TEMPERATURE_MIN || temperature > TEMPERATURE_MAX);

        boolean alerteTension = false;
        if (tensionArteriel != null && tensionArteriel.contains("/")) {
            try {
                String[] valeurs = tensionArteriel.split("/");
                int systolique = Integer.parseInt(valeurs[0].trim());
                int diastolique = Integer.parseInt(valeurs[1].trim());
                alerteTension = systolique > TENSION_SYSTOLIQUE_MAX || diastolique > TENSION_DIASTOLIQUE_MAX;
            } catch (NumberFormatException e) {
                // format de tension non exploitable, on ignore l'alerte tension
                alerteTension = false;
            }
        }

        return alerteTemperature || alerteTension;
    }
}
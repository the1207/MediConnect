package com.Mediconnect.mapper;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConstanteDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Repositories.MedecinRepository;
import com.Mediconnect.Repositories.PatientRepository;
import com.Mediconnect.Service.SeuilAlerteService;
import com.Mediconnect.enumeration.Priorite;
import com.Mediconnect.security.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ConstanteMapper {
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final UserRepository userRepository;
    private final SeuilAlerteService seuilAlerteService;

    public ConstanteMapper(PatientRepository patientRepository, MedecinRepository medecinRepository,
                          UserRepository userRepository, SeuilAlerteService seuilAlerteService) {
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.userRepository = userRepository;
        this.seuilAlerteService = seuilAlerteService;
    }

    public Constante toEntity(ConstanteDtoRequest constanteDtoRequest){
        Constante constante = new Constante();
        constante.setPoids(constanteDtoRequest.poids());
        constante.setTemperature(constanteDtoRequest.temperature());
        constante.setTensionArteriel(constanteDtoRequest.tensionArteriel());
        constante.setDate(LocalDateTime.now());
        constante.setMotifVisite(constanteDtoRequest.motifVisite());

        if (constanteDtoRequest.priorite() != null) {
            constante.setPriorite(Priorite.valueOf(constanteDtoRequest.priorite()));
        } else {
            constante.setPriorite(Priorite.NORMALE);
        }

        boolean alerteTemp = seuilAlerteService.isAlerteTemperature(constanteDtoRequest.temperature());
        boolean alertePoids = seuilAlerteService.isAlertePoids(constanteDtoRequest.poids());
        boolean alerteTension = seuilAlerteService.isAlerteTension(constanteDtoRequest.tensionArteriel());

        constante.setAlerteTemperature(alerteTemp);
        constante.setAlertePoids(alertePoids);
        constante.setAlerteTension(alerteTension);
        constante.setAlerte(alerteTemp || alertePoids || alerteTension);

        if (alerteTemp || alertePoids || alerteTension) {
            constante.setPriorite(Priorite.URGENTE);
        }

        if (constanteDtoRequest.patientId() != null) {
            Patient patient = patientRepository.findById(constanteDtoRequest.patientId())
                    .orElseThrow(() -> new RuntimeException("erreur patient non trouve"));
            constante.setPatient(patient);
        }

        if (constanteDtoRequest.medecinId() != null) {
            medecinRepository.findById(constanteDtoRequest.medecinId())
                    .ifPresent(constante::setMedecin);
        }

        if (constanteDtoRequest.infirmiereId() != null) {
            userRepository.findById(constanteDtoRequest.infirmiereId())
                    .ifPresent(constante::setInfirmiere);
        }

        return constante;
    }

    public ConstanteDtoReponse toReponses(Constante constante){
        return new ConstanteDtoReponse(
                constante.getId(),
                constante.getTemperature(),
                constante.getPoids(),
                constante.getTensionArteriel(),
                constante.isAlerte(),
                constante.isAlerteTemperature(),
                constante.isAlertePoids(),
                constante.isAlerteTension(),
                constante.getDate(),
                constante.getPatient() != null ? constante.getPatient().getId() : null,
                constante.getPatient() != null ? constante.getPatient().getNom() : null,
                constante.getPatient() != null ? constante.getPatient().getPrenom() : null,
                constante.getMedecin() != null ? constante.getMedecin().getId() : null,
                constante.getInfirmiere() != null ? constante.getInfirmiere().getId() : null,
                constante.getInfirmiere() != null ? constante.getInfirmiere().getNom() : null,
                constante.getMotifVisite(),
                constante.getPriorite() != null ? constante.getPriorite().name() : "NORMALE"
        );
    }

    public List<ConstanteDtoReponse> toReponseList(List<Constante> constanteList){
        return constanteList.stream().map(this::toReponses).toList();
    }
}

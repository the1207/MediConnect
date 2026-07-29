package com.Mediconnect.Service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Mediconnect.Dto.DtoReponse.FileAttenteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.FileAttenteDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Entities.FileAttente;
import com.Mediconnect.Entities.Patient;
import com.Mediconnect.Repositories.ConstanteRepository;
import com.Mediconnect.Repositories.FileAttenteRepository;
import com.Mediconnect.Repositories.PatientRepository;
import com.Mediconnect.Service.FileAttenteService;
import com.Mediconnect.enumeration.Priorite;
import com.Mediconnect.enumeration.StatutFileAttente;

@Service
public class FileAttenteImplementation implements FileAttenteService {

    private final FileAttenteRepository fileAttenteRepository;
    private final PatientRepository patientRepository;
    private final ConstanteRepository constanteRepository;

    public FileAttenteImplementation(FileAttenteRepository fileAttenteRepository,
                                     PatientRepository patientRepository,
                                     ConstanteRepository constanteRepository) {
        this.fileAttenteRepository = fileAttenteRepository;
        this.patientRepository = patientRepository;
        this.constanteRepository = constanteRepository;
    }

    @Override
    public FileAttenteDtoReponse create(FileAttenteDtoRequest request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        FileAttente fileAttente = new FileAttente();
        fileAttente.setPatient(patient);
        fileAttente.setMotifVisite(request.motifVisite());
        fileAttente.setPriorite(Priorite.valueOf(request.priorite()));
        fileAttente.setStatut(StatutFileAttente.EN_ATTENTE);
        fileAttente.setHeureArrivee(LocalDateTime.now());

        if (request.constanteId() != null) {
            Constante constante = constanteRepository.findById(request.constanteId()).orElse(null);
            fileAttente.setConstante(constante);
            if (constante != null && constante.isAlerte()) {
                fileAttente.setPriorite(Priorite.URGENTE);
            }
        }

        FileAttente saved = fileAttenteRepository.save(fileAttente);
        return toReponse(saved);
    }

    @Override
    public List<FileAttenteDtoReponse> getAll() {
        return fileAttenteRepository.findAllByOrderByPrioriteDescHeureArriveeAsc()
                .stream().map(this::toReponse).collect(Collectors.toList());
    }

    @Override
    public List<FileAttenteDtoReponse> getEnAttente() {
        List<StatutFileAttente> statuts = List.of(StatutFileAttente.EN_ATTENTE, StatutFileAttente.EN_CONSULTATION);
        return fileAttenteRepository.findByStatutInOrderByPrioriteDescHeureArriveeAsc(statuts)
                .stream().map(this::toReponse).collect(Collectors.toList());
    }

    @Override
    public FileAttenteDtoReponse passerEnConsultation(Long id) {
        FileAttente fileAttente = fileAttenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrée file d'attente introuvable"));
        fileAttente.setStatut(StatutFileAttente.EN_CONSULTATION);
        return toReponse(fileAttenteRepository.save(fileAttente));
    }

    @Override
    public FileAttenteDtoReponse terminer(Long id) {
        FileAttente fileAttente = fileAttenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrée file d'attente introuvable"));
        fileAttente.setStatut(StatutFileAttente.TERMINEE);
        return toReponse(fileAttenteRepository.save(fileAttente));
    }

    @Override
    public void delete(Long id) {
        fileAttenteRepository.deleteById(id);
    }

    private FileAttenteDtoReponse toReponse(FileAttente fa) {
        Constante c = fa.getConstante();
        boolean alertes = c != null && c.isAlerte();
        Double temperature = c != null ? c.getTemperature() : null;
        Double poids = c != null ? c.getPoids() : null;
        String tension = c != null ? c.getTensionArteriel() : null;
        String infirmiereNom = (c != null && c.getInfirmiere() != null) ? c.getInfirmiere().getNom() : null;

        return new FileAttenteDtoReponse(
                fa.getId(),
                fa.getPatient().getId(),
                fa.getPatient().getNom(),
                fa.getPatient().getPrenom(),
                fa.getMotifVisite(),
                fa.getPriorite().name(),
                fa.getStatut().name(),
                fa.getHeureArrivee().toString(),
                alertes,
                temperature,
                poids,
                tension,
                infirmiereNom
        );
    }
}

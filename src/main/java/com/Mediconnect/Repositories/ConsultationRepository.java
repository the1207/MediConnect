package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation,Long> {
    List<Consultation> findByMedecinId(Long medecinId);
    List<Consultation> findByPatientId(Long patientId);
    Optional<Consultation> findByOrdonnanceId(Long ordonnanceId);
}
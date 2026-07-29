package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance,Long> {
    List<Ordonnance> findByPatientId(Long patientId);
    List<Ordonnance> findByMedecinId(Long medecinId);
    List<Ordonnance> findByPatientIdOrderByDateCreationDesc(Long patientId);
}

package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance,Long> {

    // l'ordonnance n'a pas de patientId direct, on passe par la consultation qui la reference
    @Query("SELECT o FROM Ordonnance o JOIN Consultation c ON c.ordonnance = o WHERE c.patient.id = :patientId")
    List<Ordonnance> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT o FROM Ordonnance o JOIN Consultation c ON c.ordonnance = o WHERE c.medecin.id = :medecinId")
    List<Ordonnance> findByMedecinId(@Param("medecinId") Long medecinId);
}
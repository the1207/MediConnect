package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Medicament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicamentRepository extends JpaRepository<Medicament,Long> {
    List<Medicament> findByOrdonnanceId(Long ordonnanceId);

    // le medicament n'a pas de patientId direct, on remonte via Ordonnance -> Consultation -> Patient
    @Query("SELECT m FROM Medicament m JOIN Consultation c ON c.ordonnance = m.ordonnance WHERE c.patient.id = :patientId")
    List<Medicament> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT m FROM Medicament m JOIN Consultation c ON c.ordonnance = m.ordonnance WHERE c.medecin.id = :medecinId")
    List<Medicament> findByMedecinId(@Param("medecinId") Long medecinId);
}
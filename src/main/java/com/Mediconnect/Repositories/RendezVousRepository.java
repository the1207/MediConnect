package com.Mediconnect.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.enumeration.Statut;

public interface RendezVousRepository extends JpaRepository<RendezVous,Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByMedecinIdOrderByDateAscHeureAsc(Long medecinId);
    List<RendezVous> findByMedecinIdAndStatutOrderByDateAscHeureAsc(Long medecinId, Statut statut);
    long countByDisponibiliteId(Long disponibiliteId);
}
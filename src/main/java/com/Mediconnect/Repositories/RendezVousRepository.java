package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.RendezVous;
import com.Mediconnect.enumeration.Statut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RendezVousRepository extends JpaRepository<RendezVous,Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByMedecinIdAndStatutOrderByDateAscHeureAsc(Long medecinId, Statut statut);
}
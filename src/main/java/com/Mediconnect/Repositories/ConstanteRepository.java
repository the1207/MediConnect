package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Constante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConstanteRepository extends JpaRepository<Constante,Long> {
    List<Constante> findByPatientId(Long patientId);
    List<Constante> findByMedecinId(Long medecinId);
}
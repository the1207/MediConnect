package com.Mediconnect.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Mediconnect.Entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    List<Medecin> findAllByOrderByNomAscPrenomAsc();
    List<Medecin> findBySpecialiteIdOrderByNomAscPrenomAsc(Long specialiteId);
}

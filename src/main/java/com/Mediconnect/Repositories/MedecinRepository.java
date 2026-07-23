package com.Mediconnect.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Mediconnect.Entities.Medecin;

import java.util.List;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    List<Medecin> findBySpecialiteId(Long specialiteId);
}

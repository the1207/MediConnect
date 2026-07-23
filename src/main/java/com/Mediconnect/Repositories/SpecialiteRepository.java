package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpecialiteRepository extends JpaRepository<Specialite, Long> {
    Optional<Specialite> findByNomIgnoreCase(String nom); // recherche insensible a la casse, evite les doublons "cardiologie" vs "Cardiologie"
}
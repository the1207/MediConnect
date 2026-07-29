package com.Mediconnect.Repositories;

import com.Mediconnect.Entities.SeuilAlerte;
import com.Mediconnect.enumeration.TypeConstante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeuilAlerteRepository extends JpaRepository<SeuilAlerte, Long> {
    Optional<SeuilAlerte> findByTypeConstante(TypeConstante typeConstante);
}

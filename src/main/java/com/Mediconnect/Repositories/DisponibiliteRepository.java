package com.Mediconnect.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Mediconnect.Entities.Disponibilite;

public interface DisponibiliteRepository extends JpaRepository<Disponibilite,Long> {
    List<Disponibilite> findByMedecinIdOrderByDateCreneauAscHeureDebutAsc(Long medecinId);
    List<Disponibilite> findByMedecinId(Long medecinId);
}
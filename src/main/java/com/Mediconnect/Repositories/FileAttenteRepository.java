package com.Mediconnect.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Mediconnect.Entities.FileAttente;
import com.Mediconnect.enumeration.StatutFileAttente;

@Repository
public interface FileAttenteRepository extends JpaRepository<FileAttente, Long> {
    List<FileAttente> findByStatutOrderByPrioriteDescHeureArriveeAsc(StatutFileAttente statut);
    List<FileAttente> findByStatutInOrderByPrioriteDescHeureArriveeAsc(List<StatutFileAttente> statuts);
    List<FileAttente> findAllByOrderByPrioriteDescHeureArriveeAsc();
}

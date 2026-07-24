package com.Mediconnect.security.repository;


import com.Mediconnect.security.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findAllByOrderByDateHistoryDesc();
}

package com.Mediconnect.Entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Ordonnance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ordonnanceId")
    private Long id;
    private LocalDateTime dateCreation;
    @Column(name = "commentaire")
    private String commentaire;

    @OneToMany(mappedBy = "ordonnance", cascade = CascadeType.ALL)
    private List<Medicament> medicament;

    public Ordonnance() {
    }

    public Ordonnance(LocalDateTime dateCreation, String commentaire, List<Medicament> medicament) {
        this.dateCreation = dateCreation;
        this.commentaire = commentaire;
        this.medicament = medicament;
    }
    public Long getId() {
        return id;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public List<Medicament> getMedicament() {
        return medicament;
    }

    public void setMedicament(List<Medicament> medicament) {
        this.medicament = medicament;
    }
}

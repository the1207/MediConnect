package com.Mediconnect.Entities;

import jakarta.persistence.*;

@Entity
public class Medicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicamentId")
    private Long id;
    private String nom;
    private String posologie;
    @Column(name = "dureeTraitement")
    private Integer dureeTraitement; // duree en jours

    public Medicament() {
    }

    @ManyToOne
    @JoinColumn(name = "ordonnanceId")
    private Ordonnance ordonnance;

    public Medicament(String nom, String posologie, Integer dureeTraitement) {
        this.nom = nom;
        this.posologie = posologie;
        this.dureeTraitement = dureeTraitement;
    }
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPosologie() {
        return posologie;
    }

    public void setPosologie(String posologie) {
        this.posologie = posologie;
    }

    public Integer getDureeTraitement() {
        return dureeTraitement;
    }

    public void setDureeTraitement(Integer dureeTraitement) {
        this.dureeTraitement = dureeTraitement;
    }

    public Ordonnance getOrdonnance() {
        return ordonnance;
    }

    public void setOrdonnance(Ordonnance ordonnance) {
        this.ordonnance = ordonnance;
    }
}
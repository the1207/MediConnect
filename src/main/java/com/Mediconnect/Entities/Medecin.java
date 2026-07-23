package com.Mediconnect.Entities;

import java.util.List;

import jakarta.persistence.*;

@Entity
public class Medecin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medecinId")
    private Long id;
    @Column(name = "nom", nullable = false)
    private String nom;
    @Column(name="prenom",nullable = false)
    private String prenom;
    @ManyToOne
    @JoinColumn(name="specialiteId")
    private Specialite specialite;
    @OneToMany(mappedBy = "medecin")
    private List<Disponibilite> disponibilites;
    @OneToMany(mappedBy = "medecin")
    private List<Consultation> consultations;
    @OneToMany(mappedBy = "medecin")
    private List<Constante> constantes;
    @OneToMany(mappedBy = "medecin")
    private List<RendezVous> rendezVous;

    public Medecin() {
    }

    public Medecin(String nom, String prenom, Specialite specialite, List<Disponibilite> disponibilites, List<Consultation> consultations) {
        this.nom = nom;
        this.prenom = prenom;
        this.specialite = specialite;
        this.disponibilites = disponibilites;
        this.consultations = consultations;
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

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Specialite getSpecialite() {
        return specialite;
    }

    public void setSpecialite(Specialite specialite) {
        this.specialite = specialite;
    }

    public List<Disponibilite> getDisponibilites() {
        return disponibilites;
    }

    public void setDisponibilites(List<Disponibilite> disponibilites) {
        this.disponibilites = disponibilites;
    }

    public List<Consultation> getConsultations() {
        return consultations;
    }

    public void setConsultations(List<Consultation> consultations) {
        this.consultations = consultations;
    }

    public List<Constante> getConstantes() {
        return constantes;
    }

    public void setConstantes(List<Constante> constantes) {
        this.constantes = constantes;
    }

    public List<RendezVous> getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(List<RendezVous> rendezVous) {
        this.rendezVous = rendezVous;
    }
}
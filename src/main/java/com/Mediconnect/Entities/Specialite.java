package com.Mediconnect.Entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Specialite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specialiteId")
    private Long id;

    @Column(name = "nom", nullable = false, unique = true) // unique : evite les doublons style "Cardiologie" tape deux fois
    private String nom;

    @OneToMany(mappedBy = "specialite") // un cote de la relation ManyToOne cote Medecin
    private List<Medecin> medecins;

    public Specialite() {}

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public List<Medecin> getMedecins() { return medecins; }
    public void setMedecins(List<Medecin> medecins) { this.medecins = medecins; }
}
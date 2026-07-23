package com.Mediconnect.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Constante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="constanteId")
    private Long id;
    @Column(name="temperature",nullable = false)
    private Double temperature;
    @Column(name="poids",nullable = false)
    private Double poids;
    @Column(name="tensionArteriel",nullable = false)
    private String tensionArteriel;
    @Column(name="alerte")
    private boolean alerte;
    private LocalDateTime date;
    @ManyToOne
    @JoinColumn(name = "patientId")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name = "medecinId")
    private Medecin medecin;

    public Constante() {
    }

    public Constante(Double temperature, Double poids, String tensionArteriel, boolean alerte) {
        this.temperature = temperature;
        this.poids = poids;
        this.tensionArteriel = tensionArteriel;
        this.alerte = alerte;
    }
    public Long getId(){
        return id;
    }
    public Double getTemperature() {
        return temperature;
    }


    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getPoids() {
        return poids;
    }

    public void setPoids(Double poids) {
        this.poids = poids;
    }

    public String getTensionArteriel() {
        return tensionArteriel;
    }

    public void setTensionArteriel(String tensionArteriel) {
        this.tensionArteriel = tensionArteriel;
    }

    public boolean isAlerte() {
        return alerte;
    }

    public void setAlerte(boolean alerte) {
        this.alerte = alerte;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

}
package com.Mediconnect.Entities;

import java.time.LocalDateTime;

import com.Mediconnect.enumeration.Priorite;
import com.Mediconnect.security.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Column(name="alerteTemperature")
    private boolean alerteTemperature;
    @Column(name="alertePoids")
    private boolean alertePoids;
    @Column(name="alerteTension")
    private boolean alerteTension;
    private LocalDateTime date;
    @ManyToOne
    @JoinColumn(name = "patientId")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name = "medecinId")
    private Medecin medecin;
    @ManyToOne
    @JoinColumn(name = "infirmiereId")
    private User infirmiere;
    @Column(name = "motifVisite")
    private String motifVisite;
    @Enumerated(EnumType.STRING)
    @Column(name = "priorite")
    private Priorite priorite;

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

    public User getInfirmiere() {
        return infirmiere;
    }

    public void setInfirmiere(User infirmiere) {
        this.infirmiere = infirmiere;
    }

    public boolean isAlerteTemperature() {
        return alerteTemperature;
    }

    public void setAlerteTemperature(boolean alerteTemperature) {
        this.alerteTemperature = alerteTemperature;
    }

    public boolean isAlertePoids() {
        return alertePoids;
    }

    public void setAlertePoids(boolean alertePoids) {
        this.alertePoids = alertePoids;
    }

    public boolean isAlerteTension() {
        return alerteTension;
    }

    public void setAlerteTension(boolean alerteTension) {
        this.alerteTension = alerteTension;
    }

    public String getMotifVisite() {
        return motifVisite;
    }

    public void setMotifVisite(String motifVisite) {
        this.motifVisite = motifVisite;
    }

    public Priorite getPriorite() {
        return priorite;
    }

    public void setPriorite(Priorite priorite) {
        this.priorite = priorite;
    }
}
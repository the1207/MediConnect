package com.Mediconnect.Entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultationId")
    private Long id;
    @Column(name="dateDebut",nullable = false)
    private LocalDateTime dateDebut;
    @Column(name="dateFin",nullable = false)
    private LocalDateTime dateFin;
    @Column(name="motif",nullable = false)
    private String motif;
    @Column(name="actionsRequis")
    private String actionsRequis;
    @OneToOne
    @JoinColumn(name="disponibiliteId")
    private Disponibilite disponibilite;
    @ManyToOne
    @JoinColumn(name="patientId")
    private Patient patient;
    @OneToOne
    @JoinColumn(name="ordonnanceId")
    private Ordonnance ordonnance;
    @ManyToOne
    @JoinColumn(name="medecinId")
    private Medecin medecin;

    public Consultation() {
    }

    public Consultation(String motif, String actionsRequis, Medecin medecin, Disponibilite disponibilite, Patient patient, Ordonnance ordonnance) {
        this.motif = motif;
        this.actionsRequis = actionsRequis;
        this.disponibilite = disponibilite;
        this.patient = patient;
        this.ordonnance = ordonnance;
        this.medecin = medecin;
    }

    public Long getId() {
        return id;
    }
    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public String getActionsRequis() {
        return actionsRequis;
    }

    public void setActionsRequis(String actionsRequis) {
        this.actionsRequis = actionsRequis;
    }

    public Disponibilite getDisponibilite() {
        return disponibilite;
    }

    public void setDisponibilite(Disponibilite disponibilite) {
        this.disponibilite = disponibilite;
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

    public Ordonnance getOrdonnance() {
        return ordonnance;
    }

    public void setOrdonnance(Ordonnance ordonnance) {
        this.ordonnance = ordonnance;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }



}

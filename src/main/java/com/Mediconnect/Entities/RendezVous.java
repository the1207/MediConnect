package com.Mediconnect.Entities;

import java.sql.Time;
import java.util.Date;

import com.Mediconnect.enumeration.Statut;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rendezVousId")
    private Long id;
    @Column(name="dateDebut",nullable = false)
    private Date date;
    @Column(name="heure",nullable = false)
    private Time heure;
    @Column(name="statut",nullable = false)
    private Statut statut;
    @Column(name="motif",nullable = false)
    private String motif;

    @OneToOne
    @JoinColumn(name="disponibiliteId")
    private Disponibilite disponibilite;
    @ManyToOne
    @JoinColumn(name="patientId")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name="medecinId")
    private Medecin medecin;

    public RendezVous() {
    }

    public RendezVous(Date date, Time heure, Statut statut, String motif, Disponibilite disponibilite, Patient patient) {
        this.date = date;
        this.heure = heure;
        this.statut = statut;
        this.motif = motif;
        this.disponibilite = disponibilite;
        this.patient = patient;
    }
    public Long getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getHeure() {
        return heure;
    }

    public void setHeure(Time heure) {
        this.heure = heure;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
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
}
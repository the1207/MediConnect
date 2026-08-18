package com.Mediconnect.Entities;

import java.sql.Time;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Disponibilite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="disponibiliteId")
    private Long id;
    @Column(name="dateCreneau",nullable = false)
    private Date dateCreneau;
    private Time heureDebut;
    private  Time heureFin;
    private boolean reservation = false;
    private boolean actif = true;
    private Integer capacity; // null = illimité
    @ManyToOne
    @JoinColumn(name = "medecinId")
    private Medecin medecin;
    public Disponibilite() {
    }

    public Disponibilite(Date dateCreneau, Time heureDebut, Time heureFin) {
        this.dateCreneau = dateCreneau;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    public Long getId() {
        return id;
    }

    public Date getDateCreneau() {
        return dateCreneau;
    }

    public void setDateCreneau(Date dateCreneau) {
        this.dateCreneau = dateCreneau;
    }

    public Time getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(Time heureDebut) {
        this.heureDebut = heureDebut;
    }

    public Time getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(Time heureFin) {
        this.heureFin = heureFin;
    }

    public Boolean getReservation() {
        return reservation;
    }

    public void setReservation(boolean reservation) {
        this.reservation = reservation;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }
}
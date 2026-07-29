package com.Mediconnect.Entities;

import com.Mediconnect.enumeration.TypeConstante;
import jakarta.persistence.*;

@Entity
public class SeuilAlerte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seuilAlerteId")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "typeConstante", nullable = false, unique = true)
    private TypeConstante typeConstante;

    @Column(name = "valeurMin")
    private Double valeurMin;

    @Column(name = "valeurMax")
    private Double valeurMax;

    public SeuilAlerte() {
    }

    public SeuilAlerte(TypeConstante typeConstante, Double valeurMin, Double valeurMax) {
        this.typeConstante = typeConstante;
        this.valeurMin = valeurMin;
        this.valeurMax = valeurMax;
    }

    public Long getId() {
        return id;
    }

    public TypeConstante getTypeConstante() {
        return typeConstante;
    }

    public void setTypeConstante(TypeConstante typeConstante) {
        this.typeConstante = typeConstante;
    }

    public Double getValeurMin() {
        return valeurMin;
    }

    public void setValeurMin(Double valeurMin) {
        this.valeurMin = valeurMin;
    }

    public Double getValeurMax() {
        return valeurMax;
    }

    public void setValeurMax(Double valeurMax) {
        this.valeurMax = valeurMax;
    }
}

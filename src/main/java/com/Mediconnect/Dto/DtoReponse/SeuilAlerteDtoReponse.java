package com.Mediconnect.Dto.DtoReponse;

import com.Mediconnect.enumeration.TypeConstante;

public class SeuilAlerteDtoReponse {
    private Long id;
    private TypeConstante typeConstante;
    private Double valeurMin;
    private Double valeurMax;

    public SeuilAlerteDtoReponse() {
    }

    public SeuilAlerteDtoReponse(Long id, TypeConstante typeConstante, Double valeurMin, Double valeurMax) {
        this.id = id;
        this.typeConstante = typeConstante;
        this.valeurMin = valeurMin;
        this.valeurMax = valeurMax;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

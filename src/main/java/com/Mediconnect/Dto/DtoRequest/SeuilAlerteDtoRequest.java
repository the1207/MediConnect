package com.Mediconnect.Dto.DtoRequest;

import com.Mediconnect.enumeration.TypeConstante;

public class SeuilAlerteDtoRequest {
    private TypeConstante typeConstante;
    private Double valeurMin;
    private Double valeurMax;

    public SeuilAlerteDtoRequest() {
    }

    public SeuilAlerteDtoRequest(TypeConstante typeConstante, Double valeurMin, Double valeurMax) {
        this.typeConstante = typeConstante;
        this.valeurMin = valeurMin;
        this.valeurMax = valeurMax;
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

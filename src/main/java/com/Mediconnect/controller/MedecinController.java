package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.MedecinDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedecinDtoRequest;
import com.Mediconnect.Service.MedecinService;

import java.util.List;

@RestController
@RequestMapping("medecin")
public class MedecinController {
    private final MedecinService medecinService;

    public MedecinController(MedecinService medecinService){
        this.medecinService = medecinService;
    }

    @PostMapping("/create")
    public ResponseEntity<MedecinDtoReponse> create(@RequestBody MedecinDtoRequest medecinDtoRequest){
        MedecinDtoReponse medecin = medecinService.Create(medecinDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(medecin);
    }
    @GetMapping("/get/{id}")
    public MedecinDtoReponse get(@PathVariable Long id){
        return medecinService.GetMedecin(id);
    }
    @PutMapping("/update/{id}")
    public MedecinDtoReponse put(@PathVariable Long id,@RequestBody MedecinDtoRequest medecinDtoRequest){
        return medecinService.Update(id,medecinDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        medecinService.Delete(id);
    }

    @GetMapping("/historique/{id}")
    public List<ConsultationDtoReponse> consulterHistorique(@PathVariable Long id){
        return medecinService.consulterHistorique(id);
    }

    @PostMapping("/ajouterRendezvous")
    public ResponseEntity<RendezVousDtoReponse> ajouterRendezVous(@RequestBody RendezVousDtoRequest rendezVousDtoRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(medecinService.ajouterRendezVous(rendezVousDtoRequest));
    }
}
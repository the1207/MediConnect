package com.Mediconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.DisponibiliteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.DisponibiliteDtoRequest;
import com.Mediconnect.Service.DisponibiliteService;

@RestController
@RequestMapping("disponibilite")
public class DisponibiliteController {
    private final DisponibiliteService disponibiliteService;

    public DisponibiliteController(DisponibiliteService disponibiliteService){

        this.disponibiliteService = disponibiliteService;
    }

    @PostMapping("/create")
    public ResponseEntity<DisponibiliteDtoReponse> create(@RequestBody DisponibiliteDtoRequest disponibiliteDtoRequest){
        DisponibiliteDtoReponse disponibilite = disponibiliteService.Create(disponibiliteDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(disponibilite);
    }
    @GetMapping("/get/{id}")
    public DisponibiliteDtoReponse get(@PathVariable Long id){
        return disponibiliteService.GetDisponibilite(id);
    }
    @PutMapping("/update/{id}")
    public DisponibiliteDtoReponse put(@PathVariable Long id,@RequestBody DisponibiliteDtoRequest disponibiliteDtoRequest){
        return disponibiliteService.Update(id,disponibiliteDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        disponibiliteService.Delete(id);
    }

    @PutMapping("/liberer/{id}")
    public void liberer(@PathVariable Long id){
        disponibiliteService.liberer(id);
    }
    @PutMapping("/reserver/{id}")
    public void  reserver(@PathVariable Long id){
        disponibiliteService.reserver(id);
    }
    @PutMapping("/toggle/{id}")
    public void toggleActif(@PathVariable Long id, @RequestParam boolean actif){
        disponibiliteService.toggleActif(id, actif);
    }
    @GetMapping("/medecin/{medecinId}")
    public List<DisponibiliteDtoReponse> getByMedecin(@PathVariable Long medecinId){
        return disponibiliteService.GetByMedecin(medecinId);
    }
}

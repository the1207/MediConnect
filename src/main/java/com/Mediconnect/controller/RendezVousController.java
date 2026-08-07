package com.Mediconnect.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Service.RendezVousService;

@RestController
@RequestMapping("rendezVous")
public class RendezVousController {
    private final RendezVousService rendezVousService;

    public RendezVousController(RendezVousService rendezVousService){

        this.rendezVousService = rendezVousService;
    }

    @GetMapping("/get/{id}")
    public RendezVousDtoReponse get(@PathVariable Long id){
        return rendezVousService.GetRendezVous(id);
    }
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        rendezVousService.Delete(id);
    }

    @PutMapping("/refuser/{id}")
    public void refuser(@PathVariable Long id){
        rendezVousService.Refuser(id);
    }
    @PutMapping("/confirmer/{id}")
    public void confirmer(@PathVariable Long id){
        rendezVousService.Confirmer(id);
    }
    @GetMapping("/medecin/{medecinId}")
    public List<RendezVousDtoReponse> getByMedecin(@PathVariable Long medecinId){
        return rendezVousService.GetByMedecin(medecinId);
    }
    @GetMapping("/medecin/{medecinId}/confirmes")
    public List<RendezVousDtoReponse> getConfirmesByMedecin(@PathVariable Long medecinId){
        return rendezVousService.GetConfirmesByMedecin(medecinId);
    }
}


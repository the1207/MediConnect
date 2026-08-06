package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.RendezVousDtoReponse;
import com.Mediconnect.Dto.DtoRequest.RendezVousDtoRequest;
import com.Mediconnect.Service.RendezVousService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}


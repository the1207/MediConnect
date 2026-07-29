package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.OrdonnanceDtoReponse;
import com.Mediconnect.Dto.DtoRequest.OrdonnanceDtoRequest;
import com.Mediconnect.Service.OrdonnanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("ordonnance")
@CrossOrigin(origins = "http://localhost:4200")
public class OrdonnanceController {
    private final OrdonnanceService ordonnanceService;

    public OrdonnanceController(OrdonnanceService ordonnanceService){
        this.ordonnanceService = ordonnanceService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrdonnanceDtoReponse> create(@RequestBody OrdonnanceDtoRequest ordonnanceDtoRequest){
        OrdonnanceDtoReponse ordonnance = ordonnanceService.Create(ordonnanceDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ordonnance);
    }

    @GetMapping("/get/{id}")
    public OrdonnanceDtoReponse get(@PathVariable Long id){
        return ordonnanceService.GetOrdonnance(id);
    }

    @GetMapping("/all")
    public List<OrdonnanceDtoReponse> getAll(){
        return ordonnanceService.GetAllOrdonnance();
    }

    @PutMapping("/update/{id}")
    public OrdonnanceDtoReponse put(@PathVariable Long id,@RequestBody OrdonnanceDtoRequest ordonnanceDtoRequest){
        return ordonnanceService.Update(id,ordonnanceDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        ordonnanceService.Delete(id);
    }

    @PutMapping("/valider/{id}")
    public OrdonnanceDtoReponse valider(@PathVariable Long id){
        return ordonnanceService.valider(id);
    }

    @PutMapping("/imprimer/{id}")
    public OrdonnanceDtoReponse marquerImprimee(@PathVariable Long id){
        return ordonnanceService.marquerImprimee(id);
    }

    @GetMapping("/print/{id}")
    public ResponseEntity<String> imprimer(@PathVariable Long id){
        String texte = ordonnanceService.imprimer(id);
        return ResponseEntity.ok(texte);
    }

    @GetMapping("/patient/{patientId}")
    public List<OrdonnanceDtoReponse> getByPatient(@PathVariable Long patientId){
        return ordonnanceService.GetOrdonnanceByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    public List<OrdonnanceDtoReponse> getByMedecin(@PathVariable Long medecinId){
        return ordonnanceService.GetOrdonnanceByMedecin(medecinId);
    }
}

package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.MedicamentDtoReponse;
import com.Mediconnect.Dto.DtoRequest.MedicamentDtoRequest;
import com.Mediconnect.Service.MedicamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("medicament")
public class MedicamentController {
    private final MedicamentService medicamentService;

    public MedicamentController(MedicamentService medicamentService){

        this.medicamentService = medicamentService;
    }

    @PostMapping("/create")
    public ResponseEntity<MedicamentDtoReponse> create(@RequestBody MedicamentDtoRequest medicamentDtoRequest){
        MedicamentDtoReponse medicament = medicamentService.Create(medicamentDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(medicament);
    }
    @GetMapping("/get/{id}")
    public MedicamentDtoReponse get(@PathVariable Long id){
        return medicamentService.GetMedicament(id);
    }
    @PutMapping("/update/{id}")
    public MedicamentDtoReponse put(@PathVariable Long id,@RequestBody MedicamentDtoRequest medicamentDtoRequest){
        return medicamentService.Update(id,medicamentDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        medicamentService.Delete(id);
    }

    @GetMapping("/ordonnance/{ordonnanceId}")
    public List<MedicamentDtoReponse> getByOrdonnance(@PathVariable Long ordonnanceId){
        return medicamentService.GetMedicamentByOrdonnance(ordonnanceId);
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicamentDtoReponse> getByPatient(@PathVariable Long patientId){
        return medicamentService.GetMedicamentByPatient(patientId);
    }

    @GetMapping("/medecin/{medecinId}")
    public List<MedicamentDtoReponse> getByMedecin(@PathVariable Long medecinId){
        return medicamentService.GetMedicamentByMedecin(medecinId);
    }
}
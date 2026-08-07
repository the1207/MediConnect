package com.Mediconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.PatientDtoReponse;
import com.Mediconnect.Dto.DtoRequest.PatientDtoRequest;
import com.Mediconnect.Service.PatientService;

@RestController
@RequestMapping("patient")
@CrossOrigin(origins = "http://localhost:4200")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @PostMapping("/create")
    public ResponseEntity<PatientDtoReponse> create(@RequestBody PatientDtoRequest patientDtoRequest){
        PatientDtoReponse patient = patientService.Create(patientDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(patient);
    }

    @GetMapping("/get/{id}")
    public PatientDtoReponse get(@PathVariable Long id){
        return patientService.GetPatient(id);
    }

    @GetMapping("/all")
    public List<PatientDtoReponse> getAll(){
        return patientService.GetAllPatient();
    }

    @GetMapping("/medecin/{medecinId}")
    public List<PatientDtoReponse> getByMedecin(@PathVariable Long medecinId){
        return patientService.GetByMedecin(medecinId);
    }

    @PutMapping("/update/{id}")
    public PatientDtoReponse put(@PathVariable Long id, @RequestBody PatientDtoRequest patientDtoRequest){
        return patientService.Update(id,patientDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        patientService.Delete(id);
    }

    @GetMapping("/historique/{id}")
    public List<ConsultationDtoReponse> consulterHistorique(@PathVariable Long id){
        return patientService.consulterHistorique(id);
    }

    @GetMapping("/recherche")
    public List<PatientDtoReponse> rechercher(@RequestParam String nom){
        return patientService.RechercherPatient(nom);
    }
}

package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.ConstanteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConstanteDtoRequest;
import com.Mediconnect.Entities.Constante;
import com.Mediconnect.Service.ConstanteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("constante")
public class ConstanteController {
    private final ConstanteService constanteService;

    public ConstanteController(ConstanteService constanteService){

        this.constanteService = constanteService;
    }

    @PostMapping("/create")
    public ResponseEntity<ConstanteDtoReponse> create(@RequestBody ConstanteDtoRequest constanteDtoRequest){
        ConstanteDtoReponse constante = constanteService.Create(constanteDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(constante);
    }
    @GetMapping("/get/{id}")
    public ConstanteDtoReponse get(@PathVariable Long id){
        return constanteService.GetConstante(id);
    }
    @PutMapping("/update/{id}")
    public ConstanteDtoReponse put(@PathVariable Long id,@RequestBody ConstanteDtoRequest constanteDtoRequest){
        return constanteService.Update(id,constanteDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        constanteService.Delete(id);
    }

    @GetMapping("/historique/{patientId}")
    public List<ConstanteDtoReponse> historiqueParPatient(@PathVariable Long patientId){
        return constanteService.GetConstanteByPatient(patientId);
    }
}
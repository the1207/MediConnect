package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConsultationDtoRequest;
import com.Mediconnect.Entities.Consultation;
import com.Mediconnect.Service.ConsultationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("consultation")
public class ConsultationController {
    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService){

        this.consultationService = consultationService;
    }

    @PostMapping("/create")
    public ResponseEntity<ConsultationDtoReponse> create(@RequestBody ConsultationDtoRequest consultationDtoRequest){
        ConsultationDtoReponse consultation = consultationService.Create(consultationDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(consultation);
    }
    @GetMapping("/get/{id}")
    public ConsultationDtoReponse get(@PathVariable Long id){
        return consultationService.GetConsultation(id);
    }
    @PutMapping("/update/{id}")
    public ConsultationDtoReponse put(@PathVariable Long id,@RequestBody ConsultationDtoRequest consultationDtoRequest){
        return consultationService.Update(id,consultationDtoRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id){
        consultationService.Delete(id);
    }
}

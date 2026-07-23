package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.ConsultationDtoReponse;
import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.ConsultationDtoRequest;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Entities.Specialite;
import com.Mediconnect.Service.SpecialiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("specialite")
public class SpecialiteController {
    private final SpecialiteService specialiteService;

    public SpecialiteController(SpecialiteService specialiteService){
        this.specialiteService = specialiteService;
    }

    @PostMapping("/create")
    public ResponseEntity<SpecialiteDtoReponse> create(@RequestBody SpecialiteDtoRequest specialiteDtoRequest){
        SpecialiteDtoReponse specialite = specialiteService.Create(specialiteDtoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(specialite);
    }

    @GetMapping("/getAll")
    public List<SpecialiteDtoReponse> getAll(){
        return specialiteService.GetAllSpecialite();
    }
}
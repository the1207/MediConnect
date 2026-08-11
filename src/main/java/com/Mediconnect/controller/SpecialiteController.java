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
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Service.SpecialiteService;

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

    @PutMapping("/update/{id}")
    public ResponseEntity<SpecialiteDtoReponse> update(@PathVariable Long id, @RequestBody SpecialiteDtoRequest specialiteDtoRequest){
        return ResponseEntity.ok(specialiteService.Update(id, specialiteDtoRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        specialiteService.Delete(id);
        return ResponseEntity.noContent().build();
    }
}
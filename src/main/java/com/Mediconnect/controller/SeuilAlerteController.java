package com.Mediconnect.controller;

import com.Mediconnect.Dto.DtoReponse.SeuilAlerteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SeuilAlerteDtoRequest;
import com.Mediconnect.Service.SeuilAlerteService;
import com.Mediconnect.enumeration.TypeConstante;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seuil-alerte")
@CrossOrigin(origins = "http://localhost:4200")
public class SeuilAlerteController {

    private final SeuilAlerteService seuilAlerteService;

    public SeuilAlerteController(SeuilAlerteService seuilAlerteService) {
        this.seuilAlerteService = seuilAlerteService;
    }

    @PostMapping("/create")
    public ResponseEntity<SeuilAlerteDtoReponse> create(@RequestBody SeuilAlerteDtoRequest dto) {
        return new ResponseEntity<>(seuilAlerteService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SeuilAlerteDtoReponse> update(@PathVariable Long id, @RequestBody SeuilAlerteDtoRequest dto) {
        return ResponseEntity.ok(seuilAlerteService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seuilAlerteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<SeuilAlerteDtoReponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(seuilAlerteService.getById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<SeuilAlerteDtoReponse> getByType(@PathVariable TypeConstante type) {
        return ResponseEntity.ok(seuilAlerteService.getByType(type));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SeuilAlerteDtoReponse>> getAll() {
        return ResponseEntity.ok(seuilAlerteService.getAll());
    }
}

package com.Mediconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Mediconnect.Dto.DtoReponse.FileAttenteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.FileAttenteDtoRequest;
import com.Mediconnect.Service.FileAttenteService;

@RestController
@RequestMapping("/file-attente")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class FileAttenteController {

    private final FileAttenteService fileAttenteService;

    public FileAttenteController(FileAttenteService fileAttenteService) {
        this.fileAttenteService = fileAttenteService;
    }

    @PostMapping("/create")
    public ResponseEntity<FileAttenteDtoReponse> create(@RequestBody FileAttenteDtoRequest request) {
        return ResponseEntity.ok(fileAttenteService.create(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileAttenteDtoReponse>> getAll() {
        return ResponseEntity.ok(fileAttenteService.getAll());
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<FileAttenteDtoReponse>> getEnAttente() {
        return ResponseEntity.ok(fileAttenteService.getEnAttente());
    }

    @PutMapping("/en-consultation/{id}")
    public ResponseEntity<FileAttenteDtoReponse> passerEnConsultation(@PathVariable Long id) {
        return ResponseEntity.ok(fileAttenteService.passerEnConsultation(id));
    }

    @PutMapping("/terminer/{id}")
    public ResponseEntity<FileAttenteDtoReponse> terminer(@PathVariable Long id) {
        return ResponseEntity.ok(fileAttenteService.terminer(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fileAttenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

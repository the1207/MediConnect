package com.Mediconnect.Service;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.FileAttenteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.FileAttenteDtoRequest;

public interface FileAttenteService {
    FileAttenteDtoReponse create(FileAttenteDtoRequest request);
    List<FileAttenteDtoReponse> getAll();
    List<FileAttenteDtoReponse> getEnAttente();
    FileAttenteDtoReponse passerEnConsultation(Long id);
    FileAttenteDtoReponse terminer(Long id);
    void delete(Long id);
}

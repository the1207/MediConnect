package com.Mediconnect.Service;

import java.util.List;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;

public interface SpecialiteService {
    SpecialiteDtoReponse Create(SpecialiteDtoRequest specialiteDtoRequest);
    List<SpecialiteDtoReponse> GetAllSpecialite();
    SpecialiteDtoReponse Update(Long id, SpecialiteDtoRequest specialiteDtoRequest);
    void Delete(Long id);
}
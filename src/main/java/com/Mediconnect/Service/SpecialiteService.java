package com.Mediconnect.Service;

import com.Mediconnect.Dto.DtoReponse.SpecialiteDtoReponse;
import com.Mediconnect.Dto.DtoRequest.SpecialiteDtoRequest;
import com.Mediconnect.Entities.Specialite;

import java.util.List;

public interface SpecialiteService {
    SpecialiteDtoReponse Create(SpecialiteDtoRequest specialiteDtoRequest);
    List<SpecialiteDtoReponse> GetAllSpecialite();
}
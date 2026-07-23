package com.Mediconnect.security.mappers;



import BilTech.Projet_RH.security.dto.HistoryReponse;
import BilTech.Projet_RH.security.dto.RoleDTO;
import BilTech.Projet_RH.security.dto.UserDTO;
import BilTech.Projet_RH.security.dto.UserRoleReponse;
import BilTech.Projet_RH.security.model.History;
import BilTech.Projet_RH.security.model.Role;
import BilTech.Projet_RH.security.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {



    public User mapToUser(UserDTO userDTO) {
        User user = new User();
        user.setNom(userDTO.getFullName());
        user.setUsername(userDTO.getUsername());
        user.setEnable(userDTO.isEnable());
  /*      user.setCodeDirection(userDTO.getDirection() == null ? null : userDTO.getDirection());
        user.setCodeMinistere(Math.toIntExact(userDTO.getMinistere()));*/
        return user;
    }

    public UserDTO mapToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getNom());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEnable(user.isEnable());
        userDTO.setRoles(user.getRoles());
       /* userDTO.setDirection(user.getCodeDirection() == null ? null : user.getCodeDirection() );*/

        return  userDTO;
    }
    public UserRoleReponse mapToUserRoleDTO(User user) {
        UserRoleReponse userRoleReponse = new UserRoleReponse();
        userRoleReponse.setId(user.getId());
        userRoleReponse.setFullName(user.getNom());
        userRoleReponse.setUsername(user.getUsername());
        userRoleReponse.setEnable(user.isEnable());
/*
            userRoleReponse.setMinistere((long) user.getCodeMinistere());
            userRoleReponse.setDirection( user.getCodeDirection());*/
           userRoleReponse.getcreateDate(user.getCreateDate());

        userRoleReponse.setRoles(user.getRoles());
        userRoleReponse.setPublicId(user.getPublicId());

        return userRoleReponse;
    }

    public RoleDTO mapToRoleDTO(Role role) {

        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setName(String.valueOf(role.getName()));

        return roleDTO;
    }
    public HistoryReponse mapToHistoryReponse(History history) {

        HistoryReponse historyReponse = new HistoryReponse();
        historyReponse.setId(history.getId());
        historyReponse.setFullName(history.getUser().getNom());
        historyReponse.setName(history.getName());
        historyReponse.setDateHistory(history.getDateHistory());

        return historyReponse;
    }
}

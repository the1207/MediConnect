package com.Mediconnect.security.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Mediconnect.security.AccountDisabledException;
import com.Mediconnect.security.AlreadyExistException;
import com.Mediconnect.security.InvalidCredentialsException;
import com.Mediconnect.security.ResourceNotFoundException;
import com.Mediconnect.security.UserDetailsImpl;
import com.Mediconnect.security.dto.AuthenticationResponse;
import com.Mediconnect.security.dto.HistoryReponse;
import com.Mediconnect.security.dto.LoginDTO;
import com.Mediconnect.security.dto.PasswordDTO;
import com.Mediconnect.security.dto.RoleDTO;
import com.Mediconnect.security.dto.UserDTO;
import com.Mediconnect.security.dto.UserRoleReponse;
import com.Mediconnect.security.jwt.JwtUtils;
import com.Mediconnect.security.mappers.UserMapper;
import com.Mediconnect.security.model.History;
import com.Mediconnect.security.model.User;
import com.Mediconnect.security.repository.HistoryRepository;
import com.Mediconnect.security.repository.RoleRepository;
import com.Mediconnect.security.repository.UserRepository;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final HistoryRepository historyRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(@Lazy PasswordEncoder passwordEncoder, @Lazy AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserRepository userRepository, UserMapper userMapper, HistoryRepository historyRepository, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.historyRepository = historyRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public AuthenticationResponse authenticate(LoginDTO loginDTO) {

        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("user not found with username: " + loginDTO.getUsername()));

        if (!user.isEnable()) {
            throw new AccountDisabledException("Votre compte est désactivé. Contactez l'administrateur.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getUsername(),
                            loginDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            List<String> roles = userDetails.getAuthorities()
                    .stream().map(item -> item.getAuthority()).collect(Collectors.toList());

            createHistory(userDetails.getId());

            Long medecinId = user.getMedecin() != null ? user.getMedecin().getId() : null;

            return new AuthenticationResponse(token, userDetails.getId(), user.getId(),
                    userDetails.getFullName(), userDetails.getUsername(), roles, medecinId);
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Identifiant ou mot de passe incorrect");
        }
    }

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        checkIfUserExists(userDTO);
        User user = userMapper.mapToUser(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRoles(userDTO.getRoles());

        User savedUser = userRepository.save(user);

        History history = new History();
        history.setName("Enregistrement de l'utilisateur " + userDTO.getFullName());
        history.setUser(savedUser);
        history.setDateHistory(new Date());
        historyRepository.save(history);

        return userMapper.mapToUserDTO(savedUser);
    }

    @Override
    public List<UserRoleReponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(userMapper::mapToUserRoleDTO)
                .toList();
    }

    @Override
    public UserRoleReponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User is not exists with given id : " + id));

        return userMapper.mapToUserRoleDTO(user);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO, UUID id) {
        User user = userRepository.findByPublicId(id)
                .orElseThrow(() -> new ResourceNotFoundException("User is not exists with given id:" + id));

        user.setNom(userDTO.getFullName());
        user.setUsername(userDTO.getUsername());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        user.setRoles(userDTO.getRoles());

        History history = new History();
        history.setName("Modification de l'utilisateur " + userDTO.getFullName());
        history.setUser(user);
        history.setDateHistory(new Date());
        historyRepository.save(history);

        User updateUser = userRepository.save(user);

        return userMapper.mapToUserDTO(updateUser);
    }

    @Override
    public void deleteUserById(UUID id) {
        Optional<User> optionalUser = userRepository.findByPublicId(id);
        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException("Utilisateur introuvable!");
        }

        User user = optionalUser.get();
        user.setEnable(false);
        userRepository.save(user);
    }

    @Override
    public void enableUserById(UUID id) {
        Optional<User> optionalUser = userRepository.findByPublicId(id);
        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException("Utilisateur introuvable!");
        }

        User user = optionalUser.get();
        user.setEnable(true);
        userRepository.save(user);
    }

    @Override
    public UserDTO updatePassword(UUID id, PasswordDTO passwordDTO) {

        Optional<User> optionalUser = userRepository.findByPublicId(id);
        if (optionalUser.isEmpty()) {
            throw new ResourceNotFoundException("Utilisateur introuvable");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Le mot de passe actuel ne correspond pas !");
        }

        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        passwordDTO.setUserId(id);
        User updatePassword = userRepository.save(user);

        History history = new History();
        history.setName("Modification du mot de passe de l'utilisateur " + passwordDTO.getUserId());
        history.setUser(user);
        history.setDateHistory(new Date());
        historyRepository.save(history);

        return userMapper.mapToUserDTO(updatePassword);
    }

    @Override
    public List<HistoryReponse> getAllHistory() {
        return historyRepository.findAllByOrderByDateHistoryDesc()
                .stream().map(userMapper::mapToHistoryReponse)
                .toList();
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(userMapper::mapToRoleDTO)
                .toList();
    }

    private void checkIfUserExists(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new AlreadyExistException(String.format("Ce nom existe déjà !!!", userDTO.getUsername()));
        }
    }

    private History createHistory(UUID userId) {
        User user = userRepository.findByPublicId(userId).get();
        History history = new History();
        history.setName("Connexion de l'utilisateur " + user.getUsername());
        history.setUser(user);
        history.setDateHistory(new Date());

        return historyRepository.save(history);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Recherche de l'utilisateur par son nom d'utilisateur (ou email)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le nom : " + username));

        // 2. Conversion de l'entité User en UserDetails pour Spring Security
        return UserDetailsImpl.build(user);
    }
}
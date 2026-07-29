package com.Mediconnect.security;

import com.Mediconnect.Entities.SeuilAlerte;
import com.Mediconnect.Repositories.SeuilAlerteRepository;
import com.Mediconnect.enumeration.TypeConstante;
import com.Mediconnect.security.repository.UserRepository;
import com.Mediconnect.security.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SeuilAlerteRepository seuilAlerteRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, SeuilAlerteRepository seuilAlerteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.seuilAlerteRepository = seuilAlerteRepository;
    }

    @Override
    public void run(String... args) {
        createDefaultUsers();
        createDefaultSeuils();
    }

    private void createDefaultUsers() {
        if (!userRepository.existsByUsername("admin1")) {
            User admin = new User();
            admin.setNom("Admin Principal");
            admin.setUsername("admin1");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnable(true);
            admin.setRoles("ADMIN");
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("infirmiere@gmail.com")) {
            User infirmiere = new User();
            infirmiere.setNom("Infirmière Test");
            infirmiere.setUsername("infirmiere@gmail.com");
            infirmiere.setPassword(passwordEncoder.encode("infirmiere"));
            infirmiere.setEnable(true);
            infirmiere.setRoles("INFIRMIER");
            userRepository.save(infirmiere);
        }

        if (!userRepository.existsByUsername("medecin@gmail.com")) {
            User medecin = new User();
            medecin.setNom("Médecin Test");
            medecin.setUsername("medecin@gmail.com");
            medecin.setPassword(passwordEncoder.encode("medecin"));
            medecin.setEnable(true);
            medecin.setRoles("MEDECIN");
            userRepository.save(medecin);
        }
    }

    private void createDefaultSeuils() {
        if (seuilAlerteRepository.findByTypeConstante(TypeConstante.TEMPERATURE).isEmpty()) {
            SeuilAlerte seuilTemp = new SeuilAlerte(TypeConstante.TEMPERATURE, 36.0, 38.0);
            seuilAlerteRepository.save(seuilTemp);
        }

        if (seuilAlerteRepository.findByTypeConstante(TypeConstante.POIDS).isEmpty()) {
            SeuilAlerte seuilPoids = new SeuilAlerte(TypeConstante.POIDS, 40.0, 150.0);
            seuilAlerteRepository.save(seuilPoids);
        }

        if (seuilAlerteRepository.findByTypeConstante(TypeConstante.TENSION_ARTERIELLE).isEmpty()) {
            SeuilAlerte seuilTension = new SeuilAlerte(TypeConstante.TENSION_ARTERIELLE, 90.0, 140.0);
            seuilAlerteRepository.save(seuilTension);
        }
    }
}

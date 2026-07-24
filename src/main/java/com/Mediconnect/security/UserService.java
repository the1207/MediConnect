package com.Mediconnect.security;

import com.Mediconnect.security.model.User;
import com.Mediconnect.security.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
@AllArgsConstructor

/**
 * Charge les détails d'un utilisateur à partir de son nom d'utilisateur.
 * Cette méthode est utilisée par Spring Security lors de l'authentification.
 *
 * @param username le nom d'utilisateur à charger
 * @return un objet UserDetails qui sera utilisé par Spring Security
 * @throws UsernameNotFoundException si l'utilisateur n'est pas trouvé
 */
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));



        return UserDetailsImpl.build(user);
    }


}
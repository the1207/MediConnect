package com.Mediconnect.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Mediconnect.security.jwt.AuthEntryPointJwt;
import com.Mediconnect.security.jwt.AuthTokenFilter;
import com.Mediconnect.security.service.UserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserService userService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final AuthTokenFilter authenticationFilter;

    public SecurityConfig(@Lazy UserService userService, AuthEntryPointJwt unauthorizedHandler, AuthTokenFilter authenticationFilter) {
        this.userService = userService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(unauthorizedHandler::commence)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/v1/login", "/error", "/swagger-ui.html", "/swagger-ui/**",
                                "/v3/api-docs", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/v1/users/**", "/api/v1/role", "/api/v1/history").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/specialite/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/specialite/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers(HttpMethod.GET, "/medecin/get/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers(HttpMethod.GET, "/medecin/historique/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers(HttpMethod.POST, "/medecin/ajouterRendezvous").hasAnyRole("ADMIN", "INFIRMIER")
                        .requestMatchers("/medecin/create", "/medecin/update/**", "/medecin/delete/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/disponibilite/create").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers("/disponibilite/update/**", "/disponibilite/delete/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers("/disponibilite/reserver/**").hasAnyRole("ADMIN", "INFIRMIER", "MEDECIN")
                        .requestMatchers("/disponibilite/liberer/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers(HttpMethod.GET, "/disponibilite/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/rendezVous/refuser/**", "/rendezVous/confirmer/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers("/rendezVous/delete/**").hasAnyRole("ADMIN", "INFIRMIER")
                        .requestMatchers(HttpMethod.GET, "/rendezVous/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/patient/create", "/patient/update/**").hasAnyRole("ADMIN", "INFIRMIER")
                        .requestMatchers("/patient/delete/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/patient/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/constante/create", "/constante/update/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/constante/delete/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers(HttpMethod.GET, "/constante/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/consultation/create", "/consultation/update/**", "/consultation/delete/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers(HttpMethod.GET, "/consultation/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/ordonnance/**", "/medicament/**").hasAnyRole("ADMIN", "MEDECIN")
                        .requestMatchers(HttpMethod.GET, "/seuil-alerte/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .requestMatchers("/seuil-alerte/**").hasRole("ADMIN")
                        .requestMatchers("/file-attente/**").hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                        .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000).includeSubDomains(true))
                        .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'"))
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost:4201"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
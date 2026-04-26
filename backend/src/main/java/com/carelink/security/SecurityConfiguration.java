package com.carelink.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter,
                        AuthenticationProvider authenticationProvider) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.authenticationProvider = authenticationProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(Customizer.withDefaults())
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/v1/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/certificate/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/invoice/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/profile-picture/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/lab-report/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/uploads/lab-report").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/uploads/certificate").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/uploads/profile-picture").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/schedules/slots").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/schedules/doctors")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/appointments/book")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/reviews").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/laboratory/tests").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/laboratory/slots/available")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/lab-slots/available")
                                                .permitAll()
                                                .requestMatchers("/api/v1/sales/**").permitAll()
                                                .requestMatchers("/api/v1/medicines/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/notices/active").permitAll()
                                                
                                                /* Emergency Service Rules */
                                                .requestMatchers("/api/v1/emergency/panic").hasRole("PATIENT")
                                                .requestMatchers("/api/v1/emergency/**").hasAnyRole("EMERGENCY", "ADMIN")

                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}

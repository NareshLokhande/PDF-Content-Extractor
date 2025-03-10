package com.example.pdfocr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/pdf/upload").authenticated() // Protect specific endpoint
            .anyRequest().permitAll() // Allow others
        )
        .httpBasic(basic -> {
        }); // New Lambda syntax to replace deprecated httpBasic()

    return http.build();
  }
}

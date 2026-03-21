package com.interviewcoach.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed.origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        
        // Split the allowedOrigins by comma and add each one
        if (allowedOrigins != null) {
            String[] origins = allowedOrigins.split(",");
            for (String origin : origins) {
                config.addAllowedOriginPattern(origin.trim());
            }
        }
        
        // Safety: Always allow the production Vercel URL
        config.addAllowedOriginPattern("https://interviewcoach-ai-12.vercel.app");
        
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}

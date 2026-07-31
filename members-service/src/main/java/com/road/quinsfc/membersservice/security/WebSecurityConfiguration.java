package com.road.quinsfc.membersservice.security;

import com.road.quinsfc.membersservice.service.MembersService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
@Configuration
public class WebSecurityConfiguration {
    private final MembersService membersService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Environment environment;

    public WebSecurityConfiguration(MembersService membersService, BCryptPasswordEncoder bCryptPasswordEncoder, Environment environment) {
        this.membersService = membersService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.environment = environment;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(membersService);
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, AuthenticationManager authenticationManager) throws Exception {
        AuthenticationFilter authenticationFilter =
                new AuthenticationFilter(authenticationManager, membersService, environment);
        String loginUrlPath = environment.getProperty("login.url.path");
        if (loginUrlPath == null || loginUrlPath.isBlank()) {
            loginUrlPath = "/api/members/login";
        }
        authenticationFilter.setFilterProcessesUrl(loginUrlPath);

        httpSecurity.securityMatcher("/**")
                .authorizeHttpRequests(rmr -> rmr
                        .requestMatchers("/**").permitAll())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilterBefore(new FilterExceptionLoggingFilter(), org.springframework.security.web.context.SecurityContextHolderFilter.class)
                .addFilter(authenticationFilter)
                .authenticationProvider(authenticationProvider())
                .sessionManagement(smc -> smc
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "userId"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

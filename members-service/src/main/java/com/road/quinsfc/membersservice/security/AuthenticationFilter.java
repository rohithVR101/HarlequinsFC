package com.road.quinsfc.membersservice.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.road.quinsfc.membersservice.model.AuthenticationRequestModel;
import com.road.quinsfc.membersservice.service.MembersService;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

    private final MembersService membersService;
    private final Environment environment;

    public AuthenticationFilter(AuthenticationManager authenticationManager, MembersService membersService, Environment environment) {
        super(authenticationManager);
        this.membersService = membersService;
        this.environment = environment;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            AuthenticationRequestModel credentials = new ObjectMapper().readValue(request.getInputStream(), AuthenticationRequestModel.class);
            logger.info("Attempting authentication for user: {}", credentials != null ? credentials.getUser() : "null");
            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.getUser(), credentials.getPassword(), new ArrayList<>())
            );
        } catch (Exception e) {
            logger.error("Error during authentication attempt for path [{}]: ", request.getRequestURI(), e);
            if (e instanceof AuthenticationException authException) {
                throw authException;
            }
            throw new RuntimeException("Authentication request processing failed", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
        logger.info("Authentication successful for user: {}", user.getUsername());
        long expiryTime = Long.parseLong(Objects.requireNonNull(environment.getProperty("token.expiration_time")));
        String tokenSecret = environment.getProperty("token.secret");
        byte[] secretKeyBytes = Base64.getEncoder().encode(Objects.requireNonNull(tokenSecret).getBytes());
        SecretKey secretKey = new SecretKeySpec(secretKeyBytes, "HmacSHA512");
        String token = Jwts.builder()
                .subject(user.getUsername())
                .expiration(Date.from(Instant.now().plusMillis(expiryTime)))
                .issuedAt(Date.from(Instant.now()))
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
        response.addHeader("Authorization", token);
        response.addHeader("userId", user.getUsername());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                                AuthenticationException failed) throws IOException, ServletException {
        logger.error("Authentication failed for request to [{}]: {}", request.getRequestURI(), failed.getMessage(), failed);
        super.unsuccessfulAuthentication(request, response, failed);
    }
}

package com.road.quinsfc.membersservice.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.road.quinsfc.membersservice.model.AuthenticationRequestModel;
import com.road.quinsfc.membersservice.service.MembersService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureAlgorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final MembersService membersService;
    public Environment environment;

    public AuthenticationFilter(AuthenticationManager authenticationManager, MembersService membersService, Environment environment) {
        super(authenticationManager);
        this.membersService = membersService;
        this.environment = environment;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            AuthenticationRequestModel credentials = new ObjectMapper().readValue(request.getInputStream(), AuthenticationRequestModel.class);
            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.getUser(), credentials.getPassword(), new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
//        MemberDTO memberDetails = membersService.findByUserName(user.getUsername());
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
        response.addHeader("Access-Control-Expose-Headers", "Authorization");
        response.addHeader("Access-Control-Allow-Headers", "Authorization, X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, X-Custom-header");
    }
}

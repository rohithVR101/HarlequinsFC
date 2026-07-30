package com.road.quinsfc.apigateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Objects;

@Component
public class AuthorizationFilterHeader extends AbstractGatewayFilterFactory<AuthorizationFilterHeader.Config> {

    private final Environment environment;

    public AuthorizationFilterHeader(Environment environment) {
        super(Config.class);
        this.environment = environment;
    }

    public static class Config {
        //Put the configuration properties for your filter here
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest serverHttpRequest = exchange.getRequest();
            if (!serverHttpRequest.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange);
            }
            String token = Objects.requireNonNull(serverHttpRequest.getHeaders()
                            .get(HttpHeaders.AUTHORIZATION))
                    .get(0)
                    .replace("Bearer ", "");
            if (!isJWTValid(token)) {
                return onError(exchange);
            }
            return chain.filter(exchange);
        };
    }

    private static Mono<Void> onError(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    boolean isJWTValid(String token) {
        String secret = environment.getProperty("token.secret");
        byte[] secretKeyBytes = Base64.getEncoder().encode(Objects.requireNonNull(secret).getBytes());
        SecretKey secretKey = new SecretKeySpec(secretKeyBytes, "HmacSHA512");
        JwtParser jwtParser = Jwts.parser().verifyWith(secretKey).build();
        try {
            Claims claims = jwtParser.parseSignedClaims(token).getPayload();
            String subject = claims.getSubject();
            if (subject == null || subject.isBlank()) {
                return false;
            }
        } catch (Exception exception) {
            return false;
        }
        return true;
    }

}

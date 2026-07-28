package com.road.quinsfc.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import  org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder, AuthorizationFilterHeader authorizationFilterHeader) {
        return builder.routes()
//                .route("user-auth-service", r -> r
//                        .path("/api/users/**", "/api/auth/**", "/oauth2/authorization/**", "/login/oauth2/code/**")
//                        .uri("lb://user-auth-service"))
                .route("members-service",
                        r -> r.header(HttpHeaders.AUTHORIZATION, "Bearer (.*)")
                                .and()
                                .method(HttpMethod.GET, HttpMethod.DELETE)
                                .and()
                                .path("/members/**")
                                .filters(f -> f.filter(authorizationFilterHeader.apply(new AuthorizationFilterHeader.Config())))
                                .uri("lb://members-ms"))
                .route("members-service",
                        r -> r.method(HttpMethod.POST)
                                .and()
                                .path("/members/**")
                                .uri("lb://members-ms"))
                .route("parking-service",
                        r -> r.path("/parking/**")
                                .uri("lb://parking-ms"))
                .build();
    }
}

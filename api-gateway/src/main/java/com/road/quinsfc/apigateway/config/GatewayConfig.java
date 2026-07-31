package com.road.quinsfc.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder, AuthorizationFilterHeader authorizationFilterHeader) {
        return builder.routes()
                .route("members-service-protected",
                        r -> r.header(HttpHeaders.AUTHORIZATION, "Bearer (.*)")
                                .and()
                                .method(HttpMethod.GET, HttpMethod.DELETE)
                                .and()
                                .path("/api/members/**")
                                .filters(f -> f.filter(authorizationFilterHeader.apply(new AuthorizationFilterHeader.Config())))
                                .uri("lb://members-ms"))
                .route("members-service-public",
                        r -> r.method(HttpMethod.POST)
                                .and()
                                .path("/api/members/**")
                                .uri("lb://members-ms"))
                .route("parking-service",
                        r -> r.path("/api/parking/**")
                                .uri("lb://parking-ms"))
                .route("tickets-service-public",
                        r -> r.method(HttpMethod.GET)
                                .and()
                                .path("/api/tickets/availability/**")
                                .uri("lb://tickets-ms"))
                .route("tickets-service-protected",
                        r -> r.header(HttpHeaders.AUTHORIZATION, "Bearer (.*)")
                                .and()
                                .path("/api/tickets/purchase", "/api/tickets/my-tickets", "/api/tickets/cancel/**")
                                .filters(f -> f.filter(authorizationFilterHeader.apply(new AuthorizationFilterHeader.Config())))
                                .uri("lb://tickets-ms"))
                .route("payments-service-public",
                        r -> r.path("/api/payments/webhook", "/api/payments/fulfill")
                                .uri("lb://payments-ms"))
                .route("payments-service-protected",
                        r -> r.header(HttpHeaders.AUTHORIZATION, "Bearer (.*)")
                                .and()
                                .path("/api/payments/**")
                                .filters(f -> f.filter(authorizationFilterHeader.apply(new AuthorizationFilterHeader.Config())))
                                .uri("lb://payments-ms"))
                .build();
    }
}

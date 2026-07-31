package com.road.quinsfc.paymentservice.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.api-key:sk_test_mock_123456789}")
    private String apiKey;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = apiKey;
    }
}

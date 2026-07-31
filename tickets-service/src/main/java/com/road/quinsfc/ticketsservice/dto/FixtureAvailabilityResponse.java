package com.road.quinsfc.ticketsservice.dto;

import com.road.quinsfc.ticketsservice.model.TicketCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FixtureAvailabilityResponse {

    private String fixtureId;
    private int totalCapacity;
    private Map<TicketCategory, Integer> categoryCounts;
    private Map<TicketCategory, Integer> categoryPrices;
}

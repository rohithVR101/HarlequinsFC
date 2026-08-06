package com.road.quinsfc.parkingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneAvailabilityResponse {
    private String zoneId;
    private String zoneName;
    private String location;
    private Integer totalCapacity;
    private Integer reservedCount;
    private Integer availableSpaces;
    private String eligibleTier;
    private String bookingMethod;
    private Integer priceMinPence;
    private Integer priceMaxPence;
    private Boolean isBookable;
    private Boolean isActive;
}

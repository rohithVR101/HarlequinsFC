package com.road.quinsfc.parkingservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ParkingZone {

    @Id
    @Column(name = "zone_id", length = 20)
    private String zoneId;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    @Column(name = "location", nullable = false, length = 200)
    private String location;

    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity;

    @Column(name = "eligible_tier", nullable = false, length = 100)
    private String eligibleTier;

    @Column(name = "booking_method", nullable = false, length = 100)
    private String bookingMethod;

    @Column(name = "price_min_pence")
    private Integer priceMinPence;

    @Column(name = "price_max_pence")
    private Integer priceMaxPence;

    @Column(name = "is_bookable", nullable = false)
    @Builder.Default
    private Boolean isBookable = true;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

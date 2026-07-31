package com.road.quinsfc.ticketsservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "match_inventories")
public class MatchInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fixture_id", nullable = false, unique = true, length = 50)
    private String fixtureId;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "inventory_id")
    private List<MatchTierInventory> tierInventories = new ArrayList<>();

    public MatchInventory(String fixtureId, int standardAvail, int premiumAvail, int vipAvail) {
        this.fixtureId = fixtureId;
        this.tierInventories.add(new MatchTierInventory(TicketCategory.STANDARD, 20000, standardAvail));
        this.tierInventories.add(new MatchTierInventory(TicketCategory.PREMIUM, 4000, premiumAvail));
        this.tierInventories.add(new MatchTierInventory(TicketCategory.VIP, 1000, vipAvail));
    }

    /**
     * Dynamically computed total stadium capacity across all tiers (25,000)
     */
    public int getTotalCapacity() {
        return tierInventories.stream()
                .mapToInt(MatchTierInventory::getTotalSeats)
                .sum();
    }
}

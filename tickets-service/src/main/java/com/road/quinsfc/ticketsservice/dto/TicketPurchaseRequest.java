package com.road.quinsfc.ticketsservice.dto;

import com.road.quinsfc.ticketsservice.model.TicketCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketPurchaseRequest {

    @NotBlank(message = "Fixture ID is required")
    private String fixtureId;

    @NotNull(message = "Ticket category is required")
    private TicketCategory category;

    @Min(value = 1, message = "Minimum 1 ticket required")
    @Max(value = 4, message = "Maximum 4 tickets per transaction")
    private int quantity;
}

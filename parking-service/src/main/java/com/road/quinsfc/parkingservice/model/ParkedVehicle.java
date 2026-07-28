package com.road.quinsfc.parkingservice.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Document(collection = "parked-vehicles")
public class ParkedVehicle {
    @Id
    private int id;
    @NotNull(message = "User must be mapped")
    private String vehicleOwner;
    @NotNull(message = "User must be mapped")
    @Pattern(regexp = "[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$")
    private String vehicleNumber;
    @NotNull
    private LocalDateTime parkedDateTime;
}

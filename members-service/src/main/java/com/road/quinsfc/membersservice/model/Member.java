package com.road.quinsfc.membersservice.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Member {
    @NotNull
    @Pattern(regexp = "[0-9]{10}", message = "Provide a valid phone number")
    private String phoneNumber;
    private String userName;
    private String firstName;
    private String lastName;
    @Email
    private String email;
    @NotNull
    private String password;
}


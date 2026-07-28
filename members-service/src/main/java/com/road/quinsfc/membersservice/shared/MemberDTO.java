package com.road.quinsfc.membersservice.shared;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@ToString
public class MemberDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = -3068382776553136072L;

    private String phoneNumber;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}

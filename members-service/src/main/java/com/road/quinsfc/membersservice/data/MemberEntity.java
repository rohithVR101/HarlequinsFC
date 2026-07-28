package com.road.quinsfc.membersservice.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name="members")
@Getter
@Setter
@ToString
public class MemberEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1586174817200733886L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long userDBID;

    @Column(nullable = false, length = 10, unique = true)
    private String phoneNumber;
    @Column(nullable = false, unique = true)
    private String userName;
    @Column(nullable = false, length = 50)
    private String firstName;
    @Column(nullable = false, length = 50)
    private String lastName;
    @Column(nullable = false, length = 120, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String password;
}

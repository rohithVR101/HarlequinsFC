package com.road.quinsfc.membersservice.repository;

import com.road.quinsfc.membersservice.data.MemberEntity;
import org.springframework.data.repository.CrudRepository;

public interface MembersRepository extends CrudRepository<MemberEntity, Long> {

    MemberEntity findByUserName(String userName);
    MemberEntity findByEmail(String email);
    MemberEntity findByPhoneNumber(String phoneNumber);
}

package com.road.quinsfc.membersservice.service;

import com.road.quinsfc.membersservice.data.MemberEntity;
import com.road.quinsfc.membersservice.repository.MembersRepository;
import com.road.quinsfc.membersservice.shared.MemberDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MembersServiceImpl implements MembersService {

    MembersRepository membersRepository;
    BCryptPasswordEncoder bCryptPasswordEncoder;
    ModelMapper modelMapper;

    @Autowired
    public MembersServiceImpl(MembersRepository membersRepository, BCryptPasswordEncoder bCryptPasswordEncoder, ModelMapper modelMapper) {
        this.membersRepository = membersRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        MemberDTO memberDTO = findByUserNameOrEmailOrPhone(usernameOrEmail);
        if (memberDTO == null) {
            throw new UsernameNotFoundException(usernameOrEmail);
        }
        return new User(memberDTO.getUserName(), memberDTO.getPassword(), true, true, true, true, new ArrayList<>());
    }

    @Override
    public void createMember(MemberDTO memberDetails) {
        MemberEntity memberEntity = convertMemberDTOToMemberEntity(memberDetails);
        memberEntity.setPassword(bCryptPasswordEncoder.encode(memberDetails.getPassword()));
        membersRepository.save(memberEntity);
    }

    @Override
    public MemberDTO findByUserName(String userName) {
        MemberEntity memberEntity = membersRepository.findByUserName(userName);
        if (memberEntity == null) {
            throw new UsernameNotFoundException(userName);
        }
        return convertMemberEntityToMemberDTO(memberEntity);
    }

    @Override
    public MemberDTO findByEmail(String email) {
        MemberEntity memberEntity = membersRepository.findByEmail(email);
        if (memberEntity == null) {
            throw new UsernameNotFoundException(email);
        }
        return convertMemberEntityToMemberDTO(memberEntity);
    }

    @Override
    public MemberDTO findByPhoneNumber(String phoneNumber) {
        MemberEntity memberEntity = membersRepository.findByPhoneNumber(phoneNumber);
        if (memberEntity == null) {
            throw new UsernameNotFoundException(phoneNumber);
        }
        return convertMemberEntityToMemberDTO(memberEntity);
    }

    @Override
    public Iterable<MemberDTO> findAll() {
        List<MemberDTO> members = new ArrayList<>();
        membersRepository.findAll().forEach(memberEntity -> members.add(convertMemberEntityToMemberDTO(memberEntity)));
        return members;
    }

    @Override
    public MemberDTO findByUserNameOrEmailOrPhone(String identifier) {
        MemberEntity memberEntity = membersRepository.findByUserName(identifier);
        if (memberEntity == null) {
            memberEntity = membersRepository.findByEmail(identifier);
        }
        if (memberEntity == null) {
            memberEntity = membersRepository.findByPhoneNumber(identifier);
        }
        if (memberEntity == null) {
            return null;
        }
        return convertMemberEntityToMemberDTO(memberEntity);
    }

    private MemberEntity convertMemberDTOToMemberEntity(MemberDTO memberDetails) {
        return modelMapper.map(memberDetails, MemberEntity.class);
    }

    private MemberDTO convertMemberEntityToMemberDTO(MemberEntity memberDetails) {
        return modelMapper.map(memberDetails, MemberDTO.class);
    }
}

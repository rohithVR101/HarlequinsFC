package com.road.quinsfc.membersservice.unit;

import com.road.quinsfc.membersservice.controller.MemberController;
import com.road.quinsfc.membersservice.data.RestResponse;
import com.road.quinsfc.membersservice.model.Member;
import com.road.quinsfc.membersservice.service.MembersService;
import com.road.quinsfc.membersservice.shared.MemberDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberControllerTest {

    @Mock
    private MembersService membersService;

    private MemberController memberController;
    private Member sampleMember;
    private MemberDTO sampleMemberDTO;

    @BeforeEach
    void setUp() {
        ModelMapper modelMapper = new ModelMapper();
        memberController = new MemberController(modelMapper);
        ReflectionTestUtils.setField(memberController, "membersService", membersService);

        sampleMember = new Member();
        sampleMember.setFirstName("John");
        sampleMember.setLastName("Doe");
        sampleMember.setEmail("john.doe@example.com");

        sampleMemberDTO = new MemberDTO();
        sampleMemberDTO.setFirstName("John");
        sampleMemberDTO.setLastName("Doe");
        sampleMemberDTO.setEmail("john.doe@example.com");
    }

    @Test
    void createMember_Success() {
        doNothing().when(membersService).createMember(any(MemberDTO.class));

        RestResponse response = memberController.createMember(sampleMember);

        assertNotNull(response);
        assertTrue(response.isSuccessful());
        verify(membersService, times(1)).createMember(any(MemberDTO.class));
    }

    @Test
    void getAllMembers_ReturnsList() {
        when(membersService.findAll()).thenReturn(List.of(sampleMemberDTO));

        Iterable<Member> members = memberController.getAllMembers();

        assertNotNull(members);
        assertTrue(members.iterator().hasNext());
        verify(membersService, times(1)).findAll();
    }
}

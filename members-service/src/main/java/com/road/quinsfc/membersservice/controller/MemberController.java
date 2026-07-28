package com.road.quinsfc.membersservice.controller;

import com.road.quinsfc.membersservice.data.RestResponse;
import com.road.quinsfc.membersservice.model.Member;
import com.road.quinsfc.membersservice.service.MembersService;
import com.road.quinsfc.membersservice.shared.MemberDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private Environment environment;
    @Autowired
    private MembersService membersService;
    ModelMapper modelMapper;

    @Autowired
    public MemberController(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    /**
     * /create -> Creates a new user object with the given details and sends to member service to save it in db
     *
     * @param member Member request model
     * @return A string describing if the user is successfully created or not.
     */
    @PostMapping("/create")
    @ResponseBody
    public RestResponse createMember(@RequestBody Member member) {
        try {
            membersService.createMember(convertMemberToMemberDTO(member));
            return new RestResponse(true);
        }
        catch (Exception exception) {
            return new RestResponse(false, exception.getMessage());
        }
    }

    @GetMapping("/all")
    public @ResponseBody Iterable<Member> getAllMembers() {
//         This returns a JSON or XML with the members
        List<Member> members = new ArrayList<>();
        membersService.findAll().forEach(memberDTO -> members.add(convertMemberDTOToMember(memberDTO)));
        return members;
    }

    /**
     * /delete  --> Delete the user having the passed id.
     *
     * @param id The id of the user to delete
     * @return A string describing if the user is successfully deleted or not.
     */
//    @RequestMapping("/delete")
//    @ResponseBody
//    public String delete(long id) {
//        try {
//            User user = new User(id);
//            userDao.delete(user);
//        }
//        catch (Exception ex) {
//            return "Error deleting the user: " + ex.toString();
//        }
//        return "User successfully deleted!";
//    }



    /**
     * /update  --> Update the email and the name for the user in the database
     * having the passed id.
     *
     * @param id The id for the user to update.
     * @param email The new email.
     * @param name The new name.
     * @return A string describing if the user is successfully updated or not.
     */
    @RequestMapping("/update")
    @ResponseBody
    public String updateUser(long id, String email, String name) {
//        try {
//            User user = userDao.findOne(id);
//            user.setEmail(email);
//            user.setName(name);
//            userDao.save(user);
//        }
//        catch (Exception ex) {
//            return "Error updating the user: " + ex.toString();
//        }
        return "User successfully updated!";
    }
    private Member convertMemberDTOToMember(MemberDTO memberDetails) {
        return modelMapper.map(memberDetails, Member.class);
    }

    private MemberDTO convertMemberToMemberDTO(Member memberDetails) {
        return modelMapper.map(memberDetails, MemberDTO.class);
    }
}

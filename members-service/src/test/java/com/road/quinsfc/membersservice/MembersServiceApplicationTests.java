package com.road.quinsfc.membersservice;

import com.road.quinsfc.membersservice.repository.MembersRepository;
import com.road.quinsfc.membersservice.service.MembersService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
		"token.secret=mock_jwt_secret_key_for_testing_1234567890",
		"spring.cloud.config.enabled=false"
})
@ActiveProfiles("test")
class MembersServiceApplicationTests {

	@MockBean
	private MembersRepository membersRepository;

	@MockBean
	private MembersService membersService;

	@Test
	void contextLoads() {
	}

}

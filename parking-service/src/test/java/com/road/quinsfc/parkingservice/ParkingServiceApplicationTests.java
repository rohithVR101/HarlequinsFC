package com.road.quinsfc.parkingservice;

import com.road.quinsfc.parkingservice.event.PaymentEventConsumer;
import com.road.quinsfc.parkingservice.service.ParkingReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.cloud.config.import-check.enabled=false",
		"spring.config.import="
})
@ActiveProfiles("test")
class ParkingServiceApplicationTests {

	@MockBean
	private PaymentEventConsumer paymentEventConsumer;

	@MockBean
	private ParkingReservationService reservationService;

	@Test
	void contextLoads() {
	}

}

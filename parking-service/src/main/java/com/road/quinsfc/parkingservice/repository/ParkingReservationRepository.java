package com.road.quinsfc.parkingservice.repository;

import com.road.quinsfc.parkingservice.model.ParkingReservation;
import com.road.quinsfc.parkingservice.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingReservationRepository extends JpaRepository<ParkingReservation, String> {

    List<ParkingReservation> findByMemberUsernameOrderByReservedAtDesc(String memberUsername);

    List<ParkingReservation> findByFixtureId(String fixtureId);

    @Query("SELECT COUNT(r) FROM ParkingReservation r WHERE r.fixtureId = :fixtureId AND r.zone.zoneId = :zoneId AND r.status NOT IN (:excludedStatuses)")
    long countActiveReservations(
            @Param("fixtureId") String fixtureId,
            @Param("zoneId") String zoneId,
            @Param("excludedStatuses") List<ReservationStatus> excludedStatuses
    );

    boolean existsByMemberUsernameAndFixtureIdAndZone_ZoneIdAndStatusNotIn(
            String memberUsername,
            String fixtureId,
            String zoneId,
            List<ReservationStatus> excludedStatuses
    );
}

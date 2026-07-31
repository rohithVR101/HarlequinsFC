package com.road.quinsfc.ticketsservice.repository;

import com.road.quinsfc.ticketsservice.model.MatchInventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchInventoryRepository extends JpaRepository<MatchInventory, Long> {

    Optional<MatchInventory> findByFixtureId(String fixtureId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM MatchInventory m WHERE m.fixtureId = :fixtureId")
    Optional<MatchInventory> findByFixtureIdWithLock(@Param("fixtureId") String fixtureId);
}

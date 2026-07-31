package com.road.quinsfc.ticketsservice.repository;

import com.road.quinsfc.ticketsservice.model.MatchTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchTicketRepository extends JpaRepository<MatchTicket, String> {

    List<MatchTicket> findByMemberUsernameOrderByPurchasedAtDesc(String memberUsername);

    Optional<MatchTicket> findByTicketIdAndMemberUsername(String ticketId, String memberUsername);
}

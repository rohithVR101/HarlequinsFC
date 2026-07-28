package com.road.quinsfc.parkingservice.repository;

import com.road.quinsfc.parkingservice.model.ParkedVehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ParkedVehicleRepository extends MongoRepository<ParkedVehicle,Integer> {
}


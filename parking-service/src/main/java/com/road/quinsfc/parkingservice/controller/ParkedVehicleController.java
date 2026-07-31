package com.road.quinsfc.parkingservice.controller;

import com.road.quinsfc.parkingservice.model.ParkedVehicle;
import com.road.quinsfc.parkingservice.repository.ParkedVehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parking")
public class ParkedVehicleController {

    @Autowired
    private ParkedVehicleRepository parkingInfoRepository;

    @GetMapping("/parked")
    public String getVehicles(@RequestParam(value = "page", defaultValue = "1") int page,
                              @RequestParam(value = "limit", defaultValue = "1") int limit) {
//        return parkingInfoRepository.findAll();
        return "List of all vehicles";
    }

//    @GetMapping("/get-free-slot")
//    public int getFreeSlot(){
//        List<ParkedVehicle> vehicles = parkingInfoRepository.findAllOr
//        Collections.sort(vehicles);
//        for( ){
//
//        }
//    }

    @PostMapping("/park")
    public String park(@RequestBody ParkedVehicle vehicle) {
//        if(vehicle.getId()>=0 && vehicle.getId()<=100){
//            parkingInfoRepository.save(vehicle);+ vehicle.getVehicleOwner()
        return "Parked vehicle at parking slot id : " ;
//        }
//        return "Invalid Slot.";
    }

    @DeleteMapping("/unpark/{id}")
    public String unpark(@PathVariable int id) {
        return "Removed vehicle from parking slot id : " + id;
    }

}


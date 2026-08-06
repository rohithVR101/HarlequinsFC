package com.road.quinsfc.parkingservice.exceptions;

public class ZoneFullException extends RuntimeException {
    public ZoneFullException(String message) {
        super(message);
    }
}

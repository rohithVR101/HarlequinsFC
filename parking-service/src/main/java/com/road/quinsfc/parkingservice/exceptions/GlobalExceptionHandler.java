package com.road.quinsfc.parkingservice.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

public class GlobalExceptionHandler {
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<Object> handleAPIExceptions(Exception exception, WebRequest request) {
        return new ResponseEntity<>(
                exception.getLocalizedMessage(),
                new HttpHeaders(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

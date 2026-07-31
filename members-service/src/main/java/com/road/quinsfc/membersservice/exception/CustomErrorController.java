package com.road.quinsfc.membersservice.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    private static final Logger logger = LoggerFactory.getLogger(CustomErrorController.class);

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object statusAttr = request.getAttribute("jakarta.servlet.error.status_code");
        Object exception = request.getAttribute("jakarta.servlet.error.exception");
        Object message = request.getAttribute("jakarta.servlet.error.message");

        int status = statusAttr != null ? Integer.parseInt(statusAttr.toString()) : 500;
        String errorMessage = message != null ? message.toString() : "Internal Error";

        if (exception instanceof Throwable throwable) {
            logger.error("ErrorController caught exception for request to [{} {}] (Status {}): ",
                    request.getMethod(), request.getRequestURI(), status, throwable);
            errorMessage = throwable.getMessage();
        } else {
            logger.error("ErrorController caught status {} error for request to [{} {}]: {}",
                    status, request.getMethod(), request.getRequestURI(), errorMessage);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("error", HttpStatus.valueOf(status).getReasonPhrase());
        body.put("message", errorMessage);
        body.put("path", request.getRequestURI());

        return new ResponseEntity<>(body, HttpStatus.valueOf(status));
    }
}

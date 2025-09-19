package com.SeatAllotment.SeatAllotment.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEmployeeNotFoundException(EmployeeNotFoundException ex) {
        logger.warn("Employee not found: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Employee Not Found");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(SeatNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleSeatNotFoundException(SeatNotFoundException ex) {
        logger.warn("Seat not found: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Seat Not Found");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(SeatUnavailableException.class)
    public ResponseEntity<Map<String, Object>> handleSeatUnavailableException(SeatUnavailableException ex) {
        logger.warn("Seat unavailable: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Seat Unavailable");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex) {
        logger.warn("Validation error: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation Failed");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        logger.warn("Validation errors: {}", ex.getMessage());
        BindingResult result = ex.getBindingResult();
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : result.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        response.put("error", "Validation Failed");
        response.put("message", "Invalid input data");
        response.put("validationErrors", errors);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.warn("Illegal argument: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid Argument");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        logger.error("Runtime exception occurred: {}", ex.getMessage(), ex);
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", "An unexpected error occurred. Please try again later.");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        logger.error("Unexpected exception occurred: {}", ex.getMessage(), ex);
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal Server Error");
        response.put("message", "An unexpected error occurred. Please try again later.");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
package com.techsetu.exception;

import com.techsetu.dto.AuthDtos.MessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle invalid body validations (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logger.warn("Input validation failed: {}", errors);

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation Failed");
        response.put("details", errors);
        return ResponseEntity.badRequest().body(response);
    }

    // Handle wrong password or username logins
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException ex) {
        logger.warn("Authentication failed due to bad credentials");
        return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid username or password"));
    }

    // Handle fallback generic runtime errors (ensuring no stack trace leaks)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        logger.error("Internal Server Error: ", ex);
        return ResponseEntity.status(500).body(new MessageResponse("Error: An unexpected error occurred. Please contact support."));
    }
}

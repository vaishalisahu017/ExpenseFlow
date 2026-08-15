package expenseflow.expenseflow.exception;

import expenseflow.expenseflow.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Converts common application exceptions into consistent REST error responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        logger.warn("Resource not found at {}: {}", request.getRequestURI(), exception.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
            DuplicateResourceException exception,
            HttpServletRequest request
    ) {
        logger.warn("Duplicate resource at {}: {}", request.getRequestURI(), exception.getMessage());
        return buildErrorResponse(HttpStatus.CONFLICT, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException exception,
            HttpServletRequest request
    ) {
        logger.warn("Invalid credentials at {}", request.getRequestURI());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidRequest(
            InvalidRequestException exception,
            HttpServletRequest request
    ) {
        logger.warn("Invalid request at {}: {}", request.getRequestURI(), exception.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        logger.warn("Validation failed at {}", request.getRequestURI());
        Map<String, String> validationErrors = new LinkedHashMap<>();

        // Keep validation output beginner-friendly: field name -> readable message.
        exception.getBindingResult().getFieldErrors().forEach(error ->
                validationErrors.put(error.getField(), error.getDefaultMessage())
        );

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Request validation failed",
                request.getRequestURI(),
                validationErrors
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {
        logger.warn("Constraint violation at {}: {}", request.getRequestURI(), exception.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request
    ) {
        logger.warn("Type mismatch at {}: {}", request.getRequestURI(), exception.getMessage());
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Invalid value for parameter: " + exception.getName(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableMessage(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {
        logger.warn("Malformed request body at {}", request.getRequestURI());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Request body is missing or invalid", request.getRequestURI(), null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleUnsupportedMethod(
            HttpRequestMethodNotSupportedException exception,
            HttpServletRequest request
    ) {
        logger.warn("Unsupported method at {}: {}", request.getRequestURI(), exception.getMethod());
        return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, exception.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        logger.warn("Data integrity violation at {}", request.getRequestURI());
        return buildErrorResponse(HttpStatus.CONFLICT, "Request conflicts with existing data", request.getRequestURI(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(
            Exception exception,
            HttpServletRequest request
    ) {
        logger.error("Unexpected error at {}", request.getRequestURI(), exception);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong",
                request.getRequestURI(),
                null
        );
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        ErrorResponse response = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                validationErrors
        );

        return ResponseEntity.status(status).body(response);
    }
}

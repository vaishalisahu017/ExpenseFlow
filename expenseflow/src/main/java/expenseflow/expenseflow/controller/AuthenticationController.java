package expenseflow.expenseflow.controller;

import expenseflow.expenseflow.dto.LoginRequest;
import expenseflow.expenseflow.dto.LoginResponse;
import expenseflow.expenseflow.dto.RegisterRequest;
import expenseflow.expenseflow.dto.RegisterResponse;
import expenseflow.expenseflow.service.AuthenticationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes public authentication endpoints for registration and login.
 */
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("POST /auth/register for email {}", request.getEmail());
        RegisterResponse response = authenticationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("POST /auth/login for email {}", request.getEmail());
        return ResponseEntity.ok(authenticationService.login(request));
    }
}

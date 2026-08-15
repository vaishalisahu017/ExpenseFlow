package expenseflow.expenseflow.controller;

import expenseflow.expenseflow.dto.ExpenseRequest;
import expenseflow.expenseflow.dto.ExpenseResponse;
import expenseflow.expenseflow.dto.PageResponse;
import expenseflow.expenseflow.service.ExpenseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * Exposes expense management endpoints.
 */
@RestController
public class ExpenseController {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request) {
        logger.info("POST /expenses");
        ExpenseResponse createdExpense = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }

    @GetMapping("/expenses")
    public ResponseEntity<PageResponse<ExpenseResponse>> getAllExpenses(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 10, sort = "date") Pageable pageable
    ) {
        logger.info("GET /expenses");
        return ResponseEntity.ok(expenseService.getAllExpenses(title, category, startDate, endDate, pageable));
    }

    @GetMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        logger.info("GET /expenses/{}", id);
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PutMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        logger.info("PUT /expenses/{}", id);
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        logger.info("DELETE /expenses/{}", id);
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}/expenses")
    public ResponseEntity<PageResponse<ExpenseResponse>> getExpensesByUserId(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "date") Pageable pageable
    ) {
        logger.info("GET /users/{}/expenses", userId);
        return ResponseEntity.ok(expenseService.getExpensesByUserId(userId, pageable));
    }
}

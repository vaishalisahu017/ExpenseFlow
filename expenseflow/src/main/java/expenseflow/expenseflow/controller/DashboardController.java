package expenseflow.expenseflow.controller;

import expenseflow.expenseflow.dto.CategorySpendingResponse;
import expenseflow.expenseflow.dto.DashboardSummaryResponse;
import expenseflow.expenseflow.dto.ExpenseResponse;
import expenseflow.expenseflow.dto.MonthlySpendingResponse;
import expenseflow.expenseflow.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exposes dashboard and reporting endpoints for authenticated users.
 */
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        logger.info("GET /dashboard/summary");
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlySpendingResponse>> getMonthlySpending() {
        logger.info("GET /dashboard/monthly");
        return ResponseEntity.ok(dashboardService.getMonthlySpending());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategorySpendingResponse>> getCategorySpending() {
        logger.info("GET /dashboard/categories");
        return ResponseEntity.ok(dashboardService.getCategorySpending());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ExpenseResponse>> getRecentExpenses() {
        logger.info("GET /dashboard/recent");
        return ResponseEntity.ok(dashboardService.getRecentExpenses());
    }
}

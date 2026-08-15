package expenseflow.expenseflow.service;

import expenseflow.expenseflow.dto.CategorySpendingResponse;
import expenseflow.expenseflow.dto.DashboardSummaryResponse;
import expenseflow.expenseflow.dto.ExpenseResponse;
import expenseflow.expenseflow.dto.MonthlySpendingResponse;
import expenseflow.expenseflow.repository.ExpenseRepository;
import expenseflow.expenseflow.util.ExpenseMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Builds dashboard summary and reporting responses from expense data.
 */
@Service
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    private final ExpenseRepository expenseRepository;

    public DashboardService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public DashboardSummaryResponse getSummary() {
        logger.info("Building dashboard summary");

        long totalExpenses = expenseRepository.count();
        BigDecimal totalSpending = defaultToZero(expenseRepository.getTotalSpending());
        BigDecimal averageExpense = toMoney(expenseRepository.getAverageExpense());
        BigDecimal highestExpense = defaultToZero(expenseRepository.getHighestExpense());

        return new DashboardSummaryResponse(
                totalExpenses,
                totalSpending,
                averageExpense,
                highestExpense
        );
    }

    public List<MonthlySpendingResponse> getMonthlySpending() {
        logger.info("Building monthly spending report");
        return expenseRepository.getMonthlySpending();
    }

    public List<CategorySpendingResponse> getCategorySpending() {
        logger.info("Building category spending report");
        return expenseRepository.getCategorySpending();
    }

    public List<ExpenseResponse> getRecentExpenses() {
        logger.info("Fetching recent dashboard expenses");
        return expenseRepository.findTop10ByOrderByDateDescIdDesc()
                .stream()
                .map(ExpenseMapper::toResponse)
                .toList();
    }

    private BigDecimal toMoney(Double value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal defaultToZero(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }

        return value;
    }
}

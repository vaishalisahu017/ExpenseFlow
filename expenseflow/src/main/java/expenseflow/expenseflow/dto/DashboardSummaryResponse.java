package expenseflow.expenseflow.dto;

import java.math.BigDecimal;

/**
 * Summary metrics for the expense dashboard.
 */
public class DashboardSummaryResponse {

    private final long totalExpenses;
    private final BigDecimal totalSpending;
    private final BigDecimal averageExpense;
    private final BigDecimal highestExpense;

    public DashboardSummaryResponse(
            long totalExpenses,
            BigDecimal totalSpending,
            BigDecimal averageExpense,
            BigDecimal highestExpense
    ) {
        this.totalExpenses = totalExpenses;
        this.totalSpending = totalSpending;
        this.averageExpense = averageExpense;
        this.highestExpense = highestExpense;
    }

    public long getTotalExpenses() {
        return totalExpenses;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }

    public BigDecimal getAverageExpense() {
        return averageExpense;
    }

    public BigDecimal getHighestExpense() {
        return highestExpense;
    }
}

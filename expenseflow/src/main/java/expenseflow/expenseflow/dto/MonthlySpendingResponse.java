package expenseflow.expenseflow.dto;

import java.math.BigDecimal;

/**
 * Monthly spending result grouped by year and month.
 */
public class MonthlySpendingResponse {

    private final int year;
    private final int month;
    private final BigDecimal totalSpending;

    public MonthlySpendingResponse(int year, int month, BigDecimal totalSpending) {
        this.year = year;
        this.month = month;
        this.totalSpending = totalSpending;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }
}

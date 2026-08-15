package expenseflow.expenseflow.dto;

import java.math.BigDecimal;

/**
 * Spending total for one expense category.
 */
public class CategorySpendingResponse {

    private final String category;
    private final BigDecimal totalSpending;

    public CategorySpendingResponse(String category, BigDecimal totalSpending) {
        this.category = category;
        this.totalSpending = totalSpending;
    }

    public String getCategory() {
        return category;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }
}

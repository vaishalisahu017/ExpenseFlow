package expenseflow.expenseflow.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Expense response DTO returned by expense and dashboard APIs.
 */
public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;
    private Long userId;
    private String userFullName;

    public ExpenseResponse(
            Long id,
            String title,
            BigDecimal amount,
            String category,
            LocalDate date,
            String description,
            Long userId,
            String userFullName
    ) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.description = description;
        this.userId = userId;
        this.userFullName = userFullName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getDescription() {
        return description;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserFullName() {
        return userFullName;
    }
}

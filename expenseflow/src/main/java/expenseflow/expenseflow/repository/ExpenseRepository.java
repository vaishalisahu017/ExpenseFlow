package expenseflow.expenseflow.repository;

import expenseflow.expenseflow.dto.CategorySpendingResponse;
import expenseflow.expenseflow.dto.MonthlySpendingResponse;
import expenseflow.expenseflow.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

/**
 * Provides database operations and reporting queries for expenses.
 */
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    @Query("select sum(e.amount) from Expense e")
    BigDecimal getTotalSpending();

    @Query("select avg(e.amount) from Expense e")
    Double getAverageExpense();

    @Query("select max(e.amount) from Expense e")
    BigDecimal getHighestExpense();

    @Query("""
            select new expenseflow.expenseflow.dto.MonthlySpendingResponse(
                year(e.date),
                month(e.date),
                sum(e.amount)
            )
            from Expense e
            group by year(e.date), month(e.date)
            order by year(e.date), month(e.date)
            """)
    List<MonthlySpendingResponse> getMonthlySpending();

    @Query("""
            select new expenseflow.expenseflow.dto.CategorySpendingResponse(
                e.category,
                sum(e.amount)
            )
            from Expense e
            group by e.category
            order by sum(e.amount) desc
            """)
    List<CategorySpendingResponse> getCategorySpending();

    List<Expense> findTop10ByOrderByDateDescIdDesc();
}

package expenseflow.expenseflow.util;

import expenseflow.expenseflow.dto.ExpenseRequest;
import expenseflow.expenseflow.dto.ExpenseResponse;
import expenseflow.expenseflow.entity.Expense;
import expenseflow.expenseflow.entity.User;

public final class ExpenseMapper {

    private ExpenseMapper() {
    }

    public static Expense toEntity(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        expense.setUser(user);
        return expense;
    }

    public static ExpenseResponse toResponse(Expense expense) {
        User user = expense.getUser();

        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getDescription(),
                user.getId(),
                user.getFullName()
        );
    }

    public static void updateEntity(Expense expense, ExpenseRequest request, User user) {
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        expense.setUser(user);
    }
}

package expenseflow.expenseflow.service;

import expenseflow.expenseflow.dto.ExpenseRequest;
import expenseflow.expenseflow.dto.ExpenseResponse;
import expenseflow.expenseflow.dto.PageResponse;
import expenseflow.expenseflow.entity.Expense;
import expenseflow.expenseflow.entity.User;
import expenseflow.expenseflow.exception.InvalidRequestException;
import expenseflow.expenseflow.exception.ResourceNotFoundException;
import expenseflow.expenseflow.repository.ExpenseRepository;
import expenseflow.expenseflow.repository.UserRepository;
import expenseflow.expenseflow.util.ExpenseMapper;
import expenseflow.expenseflow.util.PageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Handles expense CRUD, filtering, searching, sorting, and pagination.
 */
@Service
public class ExpenseService {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        logger.info("Creating expense for user id {}", request.getUserId());

        User user = findUserById(request.getUserId());
        Expense savedExpense = expenseRepository.save(ExpenseMapper.toEntity(request, user));
        return ExpenseMapper.toResponse(savedExpense);
    }

    public PageResponse<ExpenseResponse> getAllExpenses(
            String title,
            String category,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        logger.info("Fetching expenses page {} with size {}", pageable.getPageNumber(), pageable.getPageSize());
        validateDateRange(startDate, endDate);
        return PageMapper.toResponse(
                expenseRepository.findAll(buildExpenseFilters(title, category, startDate, endDate), pageable),
                ExpenseMapper::toResponse
        );
    }

    public ExpenseResponse getExpenseById(Long id) {
        logger.info("Fetching expense with id {}", id);

        Expense expense = findExpenseById(id);
        return ExpenseMapper.toResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        logger.info("Updating expense with id {}", id);

        Expense expense = findExpenseById(id);
        User user = findUserById(request.getUserId());

        ExpenseMapper.updateEntity(expense, request, user);
        Expense updatedExpense = expenseRepository.save(expense);
        return ExpenseMapper.toResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {
        logger.info("Deleting expense with id {}", id);

        Expense expense = findExpenseById(id);
        expenseRepository.delete(expense);
    }

    public PageResponse<ExpenseResponse> getExpensesByUserId(Long userId, Pageable pageable) {
        logger.info("Fetching expenses for user id {}", userId);

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return PageMapper.toResponse(
                expenseRepository.findAll((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("user").get("id"), userId), pageable),
                ExpenseMapper::toResponse
        );
    }

    private Expense findExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new InvalidRequestException("startDate must be before or equal to endDate");
        }
    }

    private Specification<Expense> buildExpenseFilters(
            String title,
            String category,
            LocalDate startDate,
            LocalDate endDate
    ) {
        return Specification.where(titleContains(title))
                .and(categoryEquals(category))
                .and(dateOnOrAfter(startDate))
                .and(dateOnOrBefore(endDate));
    }

    private Specification<Expense> titleContains(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + title.toLowerCase() + "%"
            );
        };
    }

    private Specification<Expense> categoryEquals(String category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase());
        };
    }

    private Specification<Expense> dateOnOrAfter(LocalDate startDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate);
        };
    }

    private Specification<Expense> dateOnOrBefore(LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            if (endDate == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate);
        };
    }
}

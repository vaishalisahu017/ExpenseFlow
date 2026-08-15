package expenseflow.expenseflow.repository;

import expenseflow.expenseflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Provides database operations for ExpenseFlow users.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}

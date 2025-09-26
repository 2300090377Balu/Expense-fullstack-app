package Fin.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import Fin.model.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // ✅ Find budget by userEmail and month (for single month retrieval)
    Optional<Budget> findByUserEmailAndMonth(String userEmail, LocalDate month);

    // 🔄 Optional: Find all budgets for a user (for displaying budget history)
    List<Budget> findAllByUserEmail(String userEmail);

    // 🔄 Optional: Find budgets in a date range for a user
    List<Budget> findAllByUserEmailAndMonthBetween(String userEmail, LocalDate start, LocalDate end);
}

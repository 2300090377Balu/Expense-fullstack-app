package Fin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Fin.model.CategoryBudget;

public interface CategoryBudgetRepository extends JpaRepository<CategoryBudget, Long> {

    // 🔄 Get all category budgets for a specific budget ID
    List<CategoryBudget> findByBudgetId(Long budgetId);

    // 🔄 Get category budgets by category name and user email (via budget relationship)
    @Query("SELECT cb FROM CategoryBudget cb WHERE cb.categoryName = :categoryName AND cb.budget.userEmail = :userEmail")
    List<CategoryBudget> findByCategoryNameAndUserEmail(String categoryName, String userEmail);

    // 🔄 Get category budgets for a user (join with budget table)
    @Query("SELECT cb FROM CategoryBudget cb WHERE cb.budget.userEmail = :userEmail")
    List<CategoryBudget> findAllByUserEmail(String userEmail);
}

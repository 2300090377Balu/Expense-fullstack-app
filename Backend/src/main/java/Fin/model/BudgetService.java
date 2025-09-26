package Fin.model;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Fin.repository.BudgetRepository;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    // ✅ Save or Update a Budget
    public Budget saveBudget(Budget budget) {
        if (budget != null && budget.getCategoryBudgets() != null) {
            for (CategoryBudget cb : budget.getCategoryBudgets()) {
                cb.setBudget(budget); // maintain relationship
            }
        }
        return budgetRepository.save(budget);
    }

    // ✅ Get a Budget by User Email and Month
    public Optional<Budget> getBudgetForMonth(String userEmail, LocalDate month) {
        if (userEmail == null || month == null) return Optional.empty();
        return budgetRepository.findByUserEmailAndMonth(userEmail, month);
    }

    // ✅ Delete Budget by ID
    public void deleteBudget(Long budgetId) {
        if (budgetId != null && budgetRepository.existsById(budgetId)) {
            budgetRepository.deleteById(budgetId);
        }
    }

    // ✅ Update only Category Budgets in an existing Budget (optional helper method)
    public Optional<Budget> updateCategoryBudgets(Long budgetId, Budget updatedBudget) {
        return budgetRepository.findById(budgetId).map(existingBudget -> {
            existingBudget.setCategoryBudgets(updatedBudget.getCategoryBudgets());
            for (CategoryBudget cb : existingBudget.getCategoryBudgets()) {
                cb.setBudget(existingBudget); // maintain link
            }
            return budgetRepository.save(existingBudget);
        });
    }
}

package Fin.model;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "category_budgets")
public class CategoryBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categoryName;

    private BigDecimal allocatedAmount;

    private BigDecimal spentAmount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)  // Use LAZY but handle it properly in fetch or DTO
    @JoinColumn(name = "budget_id")
    private Budget budget;

    // Constructors
    public CategoryBudget() {
    }

    public CategoryBudget(String categoryName, BigDecimal allocatedAmount, Budget budget) {
        this.categoryName = categoryName;
        this.allocatedAmount = allocatedAmount;
        this.budget = budget;
        this.spentAmount = BigDecimal.ZERO;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }
}
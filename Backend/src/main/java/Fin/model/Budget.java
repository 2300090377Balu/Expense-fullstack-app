package Fin.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private LocalDate month;

    private BigDecimal totalMonthlyBudget;

    private Boolean alertsEnabled;

    private Integer alertThreshold;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CategoryBudget> categoryBudgets = new ArrayList<>();

    // Constructors
    public Budget() {
    }

    public Budget(String userEmail, LocalDate month, BigDecimal totalMonthlyBudget,
                  Boolean alertsEnabled, Integer alertThreshold) {
        this.userEmail = userEmail;
        this.month = month;
        this.totalMonthlyBudget = totalMonthlyBudget;
        this.alertsEnabled = alertsEnabled;
        this.alertThreshold = alertThreshold;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDate getMonth() {
        return month;
    }

    public void setMonth(LocalDate month) {
        this.month = month;
    }

    public BigDecimal getTotalMonthlyBudget() {
        return totalMonthlyBudget;
    }

    public void setTotalMonthlyBudget(BigDecimal totalMonthlyBudget) {
        this.totalMonthlyBudget = totalMonthlyBudget;
    }

    public Boolean getAlertsEnabled() {
        return alertsEnabled;
    }

    public void setAlertsEnabled(Boolean alertsEnabled) {
        this.alertsEnabled = alertsEnabled;
    }

    public Integer getAlertThreshold() {
        return alertThreshold;
    }

    public void setAlertThreshold(Integer alertThreshold) {
        this.alertThreshold = alertThreshold;
    }

    public List<CategoryBudget> getCategoryBudgets() {
        return categoryBudgets;
    }

    public void setCategoryBudgets(List<CategoryBudget> categoryBudgets) {
        this.categoryBudgets.clear();
        if (categoryBudgets != null) {
            for (CategoryBudget cb : categoryBudgets) {
                cb.setBudget(this); // Set back-reference
                this.categoryBudgets.add(cb);
            }
        }
    }
}
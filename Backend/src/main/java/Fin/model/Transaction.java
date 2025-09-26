 package Fin.model;

import java.util.Date;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;



@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category")
    private String category;

    @Column(nullable = false)
    @PositiveOrZero(message = "Amount must be positive or zero")
    private double amount;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date = new Date();

    @Column(name = "payment_type") // New field
    private String paymentType;

    @Column(name = "note", columnDefinition = "TEXT") // New field
    private String note;
    
    @Column(nullable = false)
    private String transactionType;

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    @JsonBackReference
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
}
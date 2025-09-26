package Fin.controller;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import Fin.repository.TransactionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import Fin.model.Budget;
import Fin.model.Transaction;
import Fin.model.User;
import Fin.model.UserManagers;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")  // Allow only your frontend
public class UsersController {
    @SuppressWarnings("unused")
	private final TransactionsRepository transactionsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson for JSON conversion

    @Autowired
    private UserManagers UM;
    UsersController(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }
    @Autowired
    private Fin.model.BudgetService budgetService;


    // User Signup
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody User U) {
        // Call the updated addUser method from UserManagers
        return UM.addUser(U);
    }

    // User Sign-in
    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody User u) {
        String response = UM.validateCredentials(u.getEmail(), u.getPassword());

        if (response.startsWith("200")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(response);
    }

    // Initiate Password Reset (Send Email with Reset Link)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> initiatePasswordReset(@RequestBody User u) {
        if (u.getEmail() == null || u.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("400::Email is required");
        }
        String response = UM.initiatePasswordReset(u.getEmail());
        return ResponseEntity.ok(response);
    }

    // Reset Password using Token
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("400::Token and new password are required");
        }
        String response = UM.resetPassword(token, newPassword);
        
        if (response.startsWith("401")) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/getfullname")
	  public String getFullName(@RequestBody Map<String, String> data)
	  {
	    return UM.getFullName(data.get("csrid"));
	  }
    
    @GetMapping("/transactions/{email}")
    public ResponseEntity<String> getTransactions(@PathVariable String email) {
        try {
            List<Transaction> transactions = UM.getTransactionsByEmail(email);

            if (transactions == null || transactions.isEmpty()) {
                return ResponseEntity.ok("[]"); // ✅ Always return valid JSON
            }

            // ✅ Proper sorting in descending order (latest transactions first)
            List<Transaction> recentTransactions = transactions.stream()
                    .sorted(Comparator.comparing(Transaction::getDate, Comparator.reverseOrder())) // Corrected sorting
                    .limit(5) // Get latest 5 transactions
                    .collect(Collectors.toList());

            return ResponseEntity.ok(objectMapper.writeValueAsString(recentTransactions)); // ✅ Ensure JSON response
        } catch (Exception e) {
            e.printStackTrace(); // ✅ Debugging
            return ResponseEntity.status(500).body("[]"); // ✅ Handle errors safely
        }
    }


    @PostMapping("/addTransaction")
    public ResponseEntity<String> addTransaction(@RequestBody Transaction txn) {
        String result = UM.addTransaction(txn);
        if (result.startsWith("400")) {
            return ResponseEntity.status(400).body(result);
        }
        return ResponseEntity.ok(result); // 🔥 return 200 OK
    }


    // Delete a transaction by ID
    @DeleteMapping("/deleteTransaction/{id}")
   
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        String result = UM.deleteTransaction(id);
        if (result.startsWith("404")) return ResponseEntity.status(404).body(result);
        return ResponseEntity.status(200).body(result);
    }

    
    @GetMapping("/transactionsfull/{email}")
    public ResponseEntity<String> getTransactionsfull(@PathVariable String email) {
        try {
            List<Transaction> transactions = UM.getTransactionsByEmail(email);

            if (transactions == null || transactions.isEmpty()) {
                return ResponseEntity.ok("[]");
            }

            // Sort all transactions in descending order by date
            List<Transaction> sortedTransactions = transactions.stream()
                    .sorted(Comparator.comparing(Transaction::getDate, Comparator.reverseOrder()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(objectMapper.writeValueAsString(sortedTransactions));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("[]");
        }
    }
    
    // ✅ New endpoint: Update transaction
    @PutMapping("/updateTransaction")
    public ResponseEntity<String> updateTransaction(@RequestBody Transaction txn) {
        String result = UM.updateTransaction(txn);
        if (result.startsWith("404")) return ResponseEntity.status(404).body(result);
        if (result.startsWith("400")) return ResponseEntity.badRequest().body(result);
        if (result.startsWith("500")) return ResponseEntity.status(500).body(result);
        return ResponseEntity.ok(result); // 200
    }
    
 // ✅ Create or Update Budget
    @PostMapping("/budget/save")
    public ResponseEntity<Budget> saveBudget(@RequestBody Budget budget) {
        Budget saved = budgetService.saveBudget(budget);
        return ResponseEntity.ok(saved);
    }

 // ✅ Get Budget by userEmail and Month
    @GetMapping("/budget/get")
    public ResponseEntity<?> getBudgetForMonth(
            @RequestParam String userEmail,
            @RequestParam String month // Format: YYYY-MM-01
    ) {
        try {
            // Parse the month string to LocalDate (expected format: YYYY-MM-01)
            LocalDate parsedMonth = LocalDate.parse(month); 

            // Retrieve budget using the userEmail and parsed month
            Optional<Budget> budgetOpt = budgetService.getBudgetForMonth(userEmail, parsedMonth);

            // Check if budget exists for the provided email and month
            if (budgetOpt.isPresent()) {
                return ResponseEntity.ok(budgetOpt.get()); // Return the found budget
            } else {
                return ResponseEntity.status(404).body("No budget found for the specified month.");
            }

        } catch (Exception e) {
            // Catch invalid date format or other exceptions
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid date format. Use YYYY-MM-01. Error: " + e.getMessage());
        }
    }

    // ✅ Delete a budget by ID
    @DeleteMapping("/budget/delete/{id}")
    public ResponseEntity<String> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok("Budget deleted successfully.");
    }


    
    


}

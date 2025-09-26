package Fin.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import Fin.repository.TransactionsRepository;
import Fin.repository.UsersRepository;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserManagers {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private TransactionsRepository TR;

    @Autowired
    private EmailManager EM;

    @Autowired
    private JWTManager JWT;

    // Add user
    public ResponseEntity<Map<String, String>> addUser(User user) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("status", "error");
            response.put("message", "Email already exists");
            return ResponseEntity.status(401).body(response);
        }

        userRepository.save(user);
        response.put("status", "success");
        response.put("message", "User Registered Successfully");
        return ResponseEntity.ok(response);
    }

    // Initiate Password Reset
    public String initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (!userOptional.isPresent()) {
            return "404::Email not found";
        }

        User user = userOptional.get();
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        String subject = "Password Reset Request";
        String message = "Dear " + user.getUsername() + ",\n\n"
                + "We received a request to reset your password. Please click the link below to reset it:\n"
                + resetLink + "\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Best regards,\nYour Support Team";

        return EM.sendMail(email, subject, message);
    }

    // Reset Password
    public String resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (!userOptional.isPresent()) {
            return "401::Invalid or expired token";
        }

        User user = userOptional.get();
        user.setPassword(newPassword);
        user.setResetToken(null);
        userRepository.save(user);

        return "200::Password updated successfully";
    }

    // Validate Credentials
    public String validateCredentials(String email, String password) {
        Optional<User> user = userRepository.validateCredentials(email, password);

        if (user.isPresent()) {
            String token = JWT.generateToken(email);
            return "200::" + token;
        }

        return "401::Invalid Credentials";
    }

    // Get Full Name
    public String getFullName(String token) {
        String email = JWT.validateJWT(token);
        if (email == null || email.equals("401"))
            return "401::Invalid Token";

        User U = userRepository.findById(email).orElse(null);
        if (U == null)
            return "404::User Not Found";

        return "200::" + U.getUsername();
    }

    // Get Transactions by Email
    public List<Transaction> getTransactionsByEmail(String email) {
        return TR.findByUserEmail(email);
    }

    // Add Transaction
    @Transactional
    public String addTransaction(Transaction txn) {
        if (txn.getUser() == null || txn.getCategory() == null || txn.getAmount() <= 0 || txn.getDate() == null || txn.getTransactionType() == null) {
            return "400::Invalid Transaction Data";
        }
        if (txn.getPaymentType() == null || txn.getPaymentType().isEmpty()) {
            return "400::Payment Type is required";
        }
        if (txn.getNote() == null) {
            txn.setNote("");
        }
        TR.save(txn);
        return "200::Transaction Added Successfully";
    }

    // Delete Transaction
    @Transactional
    public String deleteTransaction(Long id) {
        if (!TR.existsById(id)) {
            return "404::Transaction Not Found";
        }
        try {
            TR.deleteById(id);
            return "200::Transaction Deleted Successfully";
        } catch (Exception e) {
            return "500::Error Deleting Transaction";
        }
    }

    // ✅ Update Transaction (No budget logic)
    @Transactional
    public String updateTransaction(Transaction updatedTxn) {
        if (updatedTxn.getId() == null || !TR.existsById(updatedTxn.getId())) {
            return "404::Transaction Not Found";
        }

        try {
            Transaction existingTxn = TR.findById(updatedTxn.getId()).orElse(null);
            if (existingTxn == null) return "404::Transaction Not Found";

            existingTxn.setCategory(updatedTxn.getCategory());
            existingTxn.setAmount(updatedTxn.getAmount());
            existingTxn.setDate(updatedTxn.getDate());
            existingTxn.setPaymentType(updatedTxn.getPaymentType());
            existingTxn.setTransactionType(updatedTxn.getTransactionType());
            existingTxn.setNote(updatedTxn.getNote());

            TR.save(existingTxn);

            return "200::Transaction Updated Successfully";
        } catch (Exception e) {
            return "500::Error Updating Transaction";
        }
    }
}

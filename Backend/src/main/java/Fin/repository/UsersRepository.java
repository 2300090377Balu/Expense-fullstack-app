package Fin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import Fin.model.User;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<User, String> {

	// Check if email exists in DB
    boolean existsByEmail(String email); 

    // Find user by email (for login & password reset)
    Optional<User> findByEmail(String email);

    // Case-insensitive email lookup
    Optional<User> findByEmailIgnoreCase(String email);

    // Find user by reset token (for password recovery)
    Optional<User> findByResetToken(String resetToken);
    
    // Validate credentials - Use Optional<User>
    @Query("SELECT u FROM User u WHERE u.email=:email AND u.password=:password")
    Optional<User> validateCredentials(String email, String password);
}

package Fin.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Exusers") // Explicit table name for clarity
public class User {

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "reset_token")
    private String resetToken;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reset_token_expiry")
    private Date resetTokenExpiry;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public Date getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(Date resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    // toString method
    @Override
    public String toString() {
        return "User [email=" + email + ", username=" + username + ", password=" + password + 
               ", resetToken=" + resetToken + ", resetTokenExpiry=" + resetTokenExpiry + "]";
    }
}

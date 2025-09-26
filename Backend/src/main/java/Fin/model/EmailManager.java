package Fin.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailManager {

    @Autowired
    private JavaMailSender JMS;

    public String sendMail(String toMail, String subject, String message) {
        try {
            // Validate email input
            if (toMail == null || toMail.isEmpty()) {
                return "400::Recipient email is required";
            }
            
            // Create a simple mail message
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom("nerellajathin2006@gmail.com");
            email.setTo(toMail);
            email.setSubject(subject);
            email.setText(message);

            // Send email
            JMS.send(email);

            System.out.println("✅ Email sent successfully to: " + toMail);
            return "200::Mail Sent Successfully";
        } catch (MailException me) {
            System.err.println("❌ Mail Sending Error: " + me.getMessage());
            return "500::Mail Sending Failed: " + me.getMessage();
        } catch (Exception e) {
            System.err.println("❌ Unexpected Error: " + e.getMessage());
            return "500::An unexpected error occurred: " + e.getMessage();
        }
    }
}

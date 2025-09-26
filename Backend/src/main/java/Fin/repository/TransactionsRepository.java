package Fin.repository;

import Fin.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionsRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserEmail(String email);

    @Query("SELECT t FROM Transaction t WHERE t.user.email = :email")
    List<Transaction> getTransactionsByUserEmail(String email);


}

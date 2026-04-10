package com.carelink.repository;

import com.carelink.entity.Notification;
import com.carelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    long countByRecipientAndIsReadFalse(User recipient);
}

package com.carelink.repository;

import com.carelink.entity.SymptomLog;
import com.carelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SymptomLogRepository extends JpaRepository<SymptomLog, Long> {
    List<SymptomLog> findByUserOrderByCreatedAtDesc(User user);
}

package com.carelink.repository;

import com.carelink.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByActiveTrueOrderByCreatedAtDesc();
    Optional<Notice> findTopByActiveTrueOrderByCreatedAtDesc();
}

package com.carelink.repository;

import com.carelink.entity.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {
    List<DoctorReview> findByDoctor_IdOrderByCreatedAtDesc(Long doctorId);
    boolean existsByAppointment_Id(Long appointmentId);
}

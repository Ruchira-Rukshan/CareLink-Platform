package com.carelink.repository;

import com.carelink.entity.LabReport;
import com.carelink.entity.LabTestStatus;
import com.carelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatient(User patient);

    List<LabReport> findByLabTech(User labTech);

    List<LabReport> findByStatus(LabTestStatus status);

    Optional<LabReport> findByBookingReference(String bookingReference);

    List<LabReport> findByPatientOrderByCreatedAtDesc(User patient);

    List<LabReport> findAllByOrderByCreatedAtDesc();

    boolean existsByLabTest(com.carelink.entity.LabTest labTest);
}

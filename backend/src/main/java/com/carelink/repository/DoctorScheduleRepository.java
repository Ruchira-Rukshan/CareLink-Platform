package com.carelink.repository;

import com.carelink.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctor_IdOrderByScheduleDateAsc(Long doctorId);

    Optional<DoctorSchedule> findByScheduleDateAndDoctor_Id(LocalDate date, Long doctorId);
}

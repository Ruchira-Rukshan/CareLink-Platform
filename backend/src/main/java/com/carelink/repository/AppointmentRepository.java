package com.carelink.repository;

import com.carelink.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor_IdOrderByAppointmentDateAsc(Long doctorId);

    List<Appointment> findByPatient_IdOrderByAppointmentDateAsc(Long patientId);
}

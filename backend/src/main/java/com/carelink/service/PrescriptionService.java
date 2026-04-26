package com.carelink.service;

import com.carelink.dto.CreatePrescriptionRequest;
import com.carelink.entity.*;
import com.carelink.repository.MedicineRepository;
import com.carelink.repository.PrescriptionRepository;
import com.carelink.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repo;
    private final UserRepository userRepo;
    private final MedicineRepository medRepo;

    public PrescriptionService(PrescriptionRepository repo, UserRepository userRepo, MedicineRepository medRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.medRepo = medRepo;
    }

    @Transactional
    public Prescription create(Long doctorId, CreatePrescriptionRequest req) {
        User doctor = userRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepo.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Prescription p = new Prescription();
        p.setDoctor(doctor);
        p.setPatient(patient);
        p.setClinicalNotes(req.getClinicalNotes());

        List<PrescriptionItem> items = req.getItems().stream().map(itemReq -> {
            Medicine med = medRepo.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(p);
            item.setMedicine(med);
            item.setDosage(itemReq.getDosage());
            item.setFrequency(itemReq.getFrequency());
            item.setDuration(itemReq.getDuration());
            item.setTotalQuantity(itemReq.getTotalQuantity());
            return item;
        }).collect(Collectors.toList());

        p.setItems(items);
        return repo.save(p);
    }

    public List<Prescription> getByPatient(Long patientId) {
        return repo.findByPatientId(patientId);
    }

    public List<Prescription> getByDoctor(Long doctorId) {
        return repo.findByDoctorId(doctorId);
    }

    public Optional<Prescription> findById(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public void markAsDispensed(Long id) {
        Prescription p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        p.setDispensed(true);
        repo.save(p);
    }
}

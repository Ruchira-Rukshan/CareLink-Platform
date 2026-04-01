package com.carelink.repository;

import com.carelink.entity.User;
import com.carelink.entity.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String token);

    List<User> findByRole(Role role);

    boolean existsByPhone(String phone);

    boolean existsByNationalId(String nationalId);

    boolean existsByMedicalLicenseNumber(String medicalLicenseNumber);

    boolean existsByCompanyRegId(String companyRegId);

    boolean existsByCompanyName(String companyName);
}

package com.carelink.repository;

import com.carelink.entity.LabSlot;
import com.carelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LabSlotRepository extends JpaRepository<LabSlot, Long> {

    List<LabSlot> findByLabTech(User labTech);

    // Find slots that have remaining capacity (bookedCount < capacity) and are not
    // closed, in the future
    @Query("SELECT s FROM LabSlot s WHERE s.testTime > :now AND s.isClosed = false AND s.bookedCount < s.capacity ORDER BY s.testTime ASC")
    List<LabSlot> findAvailableSlots(LocalDateTime now);

    // All future slots for a specific tech
    List<LabSlot> findByLabTechAndTestTimeAfterOrderByTestTimeAsc(User tech, LocalDateTime after);

    // Compatibility shim for old code
    default List<LabSlot> findByIsAvailableTrue() {
        return findAvailableSlots(LocalDateTime.now());
    }

    default List<LabSlot> findByTestTimeAfterAndIsAvailableTrue(LocalDateTime time) {
        return findAvailableSlots(time);
    }
}

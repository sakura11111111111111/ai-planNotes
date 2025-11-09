package com.aiplannotes.repository;

import com.aiplannotes.entity.ReviewRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReviewRecordRepository extends JpaRepository<ReviewRecord, Long> {
    List<ReviewRecord> findByNoteUserIdAndScheduledForLessThanEqualAndReviewedAtIsNull(
        Long userId, LocalDate date);
}

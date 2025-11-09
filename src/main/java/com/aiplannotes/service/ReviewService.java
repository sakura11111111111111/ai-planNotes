package com.aiplannotes.service;

import com.aiplannotes.dto.SubmitReviewRequest;
import com.aiplannotes.dto.SubmitReviewResponse;
import com.aiplannotes.dto.TodayTaskResponse;
import com.aiplannotes.entity.ReviewRecord;
import com.aiplannotes.exception.BusinessException;
import com.aiplannotes.repository.AiSummaryRepository;
import com.aiplannotes.repository.ReviewRecordRepository;
import com.aiplannotes.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    // Ebbinghaus forgetting curve intervals (in days)
    private static final int[] INTERVALS = {1, 2, 4, 7, 15, 30, 60, 120};
    
    @Autowired
    private ReviewRecordRepository reviewRecordRepository;
    
    @Autowired
    private AiSummaryRepository aiSummaryRepository;
    
    public List<TodayTaskResponse> getTodayTasks() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();
        
        List<ReviewRecord> records = reviewRecordRepository
                .findByNoteUserIdAndScheduledForLessThanEqualAndReviewedAtIsNull(userId, today);
        
        return records.stream()
                .map(record -> {
                    var note = record.getNote();
                    String categoryName = note.getCategory() != null ? note.getCategory().getName() : null;
                    
                    String aiSummary = aiSummaryRepository.findByNoteId(note.getId())
                            .map(summary -> summary.getSummaryText())
                            .orElse(null);
                    
                    return new TodayTaskResponse(
                            note.getId(),
                            note.getTitle(),
                            categoryName,
                            note.getIsSupervised(),
                            note.getSupervisionDurationSeconds(),
                            record.getStageNumber(),
                            aiSummary
                    );
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public SubmitReviewResponse submitReview(SubmitReviewRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();
        
        // Step 1: Find and validate the review record
        ReviewRecord currentRecord = reviewRecordRepository
                .findByNoteIdAndNoteUserIdAndScheduledForLessThanEqualAndReviewedAtIsNull(
                        request.getNoteId(), userId, today)
                .orElseThrow(() -> new BusinessException(400, "Invalid task: No pending review found for this note."));
        
        // Step 2: Update the current record
        currentRecord.setReviewedAt(new Timestamp(System.currentTimeMillis()));
        currentRecord.setResult(request.getResultEnum());
        currentRecord.setReviewDurationSeconds(request.getReviewDurationSeconds());
        reviewRecordRepository.save(currentRecord);
        
        // Step 3: Calculate next review information
        int currentStage = currentRecord.getStageNumber();
        int newStageNumber;
        LocalDate nextReviewDate;
        
        if (request.getResultEnum() == ReviewRecord.ReviewResult.REMEMBERED) {
            // Progress to next stage
            newStageNumber = currentStage + 1;
            int intervalDays = calculateInterval(newStageNumber);
            nextReviewDate = today.plusDays(intervalDays);
        } else {
            // Reset to stage 1 (FUZZY or FORGOTTEN)
            newStageNumber = 1;
            nextReviewDate = today.plusDays(1); // Review again tomorrow
        }
        
        // Step 4: Create new review record
        ReviewRecord newRecord = new ReviewRecord();
        newRecord.setNote(currentRecord.getNote());
        newRecord.setStageNumber(newStageNumber);
        newRecord.setScheduledFor(nextReviewDate);
        reviewRecordRepository.save(newRecord);
        
        return new SubmitReviewResponse(nextReviewDate);
    }
    
    /**
     * Calculate interval based on Ebbinghaus forgetting curve
     * @param stageNumber the review stage (1-based)
     * @return number of days until next review
     */
    private int calculateInterval(int stageNumber) {
        if (stageNumber <= 0) {
            return 1;
        }
        if (stageNumber > INTERVALS.length) {
            // For stages beyond our defined intervals, use the last interval
            return INTERVALS[INTERVALS.length - 1];
        }
        return INTERVALS[stageNumber - 1];
    }
}

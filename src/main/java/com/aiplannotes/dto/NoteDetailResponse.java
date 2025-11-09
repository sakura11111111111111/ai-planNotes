package com.aiplannotes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteDetailResponse {
    private Long id;
    private String title;
    private String content;
    private Long categoryId;
    private String categoryName;
    private Boolean isSupervised;
    private Integer supervisionDurationSeconds;
    private AiSummaryDto aiSummary;
    private ReviewRecordDto currentReviewRecord;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}

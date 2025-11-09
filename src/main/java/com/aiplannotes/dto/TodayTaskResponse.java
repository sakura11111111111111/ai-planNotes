package com.aiplannotes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodayTaskResponse {
    private Long noteId;
    private String title;
    private String categoryName;
    private Boolean isSupervised;
    private Integer supervisionDurationSeconds;
    private Integer currentReviewStage;
    private String aiSummary;
}

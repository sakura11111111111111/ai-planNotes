package com.aiplannotes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteListItemResponse {
    private Long id;
    private String title;
    private Boolean isSupervised;
    private String aiSummaryPreview;
    private Timestamp createdAt;
}

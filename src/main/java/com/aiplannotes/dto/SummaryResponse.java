package com.aiplannotes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryResponse {
    private String summaryText;
    private String modelUsed;
    private Timestamp createdAt;
}

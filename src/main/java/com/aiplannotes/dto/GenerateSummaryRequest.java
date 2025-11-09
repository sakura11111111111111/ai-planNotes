package com.aiplannotes.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateSummaryRequest {
    
    @NotNull(message = "noteId cannot be null")
    private Long noteId;
}

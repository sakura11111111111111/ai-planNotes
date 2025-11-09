package com.aiplannotes.dto;

import com.aiplannotes.entity.ReviewRecord;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitReviewRequest {
    
    @NotNull(message = "noteId cannot be null")
    private Long noteId;
    
    @NotNull(message = "result cannot be null")
    @Pattern(regexp = "REMEMBERED|FUZZY|FORGOTTEN", message = "result must be REMEMBERED, FUZZY, or FORGOTTEN")
    private String result;
    
    private Integer reviewDurationSeconds;
    
    public ReviewRecord.ReviewResult getResultEnum() {
        return ReviewRecord.ReviewResult.valueOf(result);
    }
}

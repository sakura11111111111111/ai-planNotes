package com.aiplannotes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNoteRequest {
    
    @NotBlank(message = "Note title cannot be empty")
    @Size(min = 1, max = 255, message = "Note title must be between 1 and 255 characters")
    private String title;
    
    @NotBlank(message = "Note content cannot be empty")
    private String content;
    
    private Long categoryId;
    
    @NotNull(message = "isSupervised cannot be null")
    private Boolean isSupervised;
    
    @NotNull(message = "supervisionDurationSeconds cannot be null")
    private Integer supervisionDurationSeconds;
}

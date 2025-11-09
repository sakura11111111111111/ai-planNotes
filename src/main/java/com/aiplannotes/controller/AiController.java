package com.aiplannotes.controller;

import com.aiplannotes.dto.ApiResponse;
import com.aiplannotes.dto.GenerateSummaryRequest;
import com.aiplannotes.dto.SummaryResponse;
import com.aiplannotes.service.AiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    
    @Autowired
    private AiService aiService;
    
    @PostMapping("/summarize")
    public ResponseEntity<ApiResponse<SummaryResponse>> generateSummary(@Valid @RequestBody GenerateSummaryRequest request) {
        SummaryResponse response = aiService.generateSummary(request);
        return ResponseEntity.ok(ApiResponse.success("AI summary generated successfully.", response));
    }
}

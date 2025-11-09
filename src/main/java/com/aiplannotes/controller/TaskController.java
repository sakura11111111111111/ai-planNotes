package com.aiplannotes.controller;

import com.aiplannotes.dto.ApiResponse;
import com.aiplannotes.dto.SubmitReviewRequest;
import com.aiplannotes.dto.SubmitReviewResponse;
import com.aiplannotes.dto.TodayTaskResponse;
import com.aiplannotes.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {
    
    @Autowired
    private ReviewService reviewService;
    
    @GetMapping("/tasks/today")
    public ResponseEntity<ApiResponse<List<TodayTaskResponse>>> getTodayTasks() {
        List<TodayTaskResponse> tasks = reviewService.getTodayTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @PostMapping("/reviews/submit")
    public ResponseEntity<ApiResponse<SubmitReviewResponse>> submitReview(@Valid @RequestBody SubmitReviewRequest request) {
        SubmitReviewResponse response = reviewService.submitReview(request);
        return ResponseEntity.ok(ApiResponse.success("Review result submitted successfully.", response));
    }
}

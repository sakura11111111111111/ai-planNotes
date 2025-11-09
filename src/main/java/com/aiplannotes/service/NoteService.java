package com.aiplannotes.service;

import com.aiplannotes.dto.*;
import com.aiplannotes.entity.*;
import com.aiplannotes.exception.BusinessException;
import com.aiplannotes.repository.*;
import com.aiplannotes.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ReviewRecordRepository reviewRecordRepository;
    
    @Autowired
    private AiSummaryRepository aiSummaryRepository;
    
    @Transactional
    public NoteDetailResponse createNote(CreateNoteRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        User user = new User();
        user.setId(userId);
        
        Note note = new Note();
        note.setUser(user);
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setIsSupervised(request.getIsSupervised());
        note.setSupervisionDurationSeconds(request.getSupervisionDurationSeconds());
        
        // Validate and set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                    .orElseThrow(() -> new BusinessException(404, "Category not found"));
            note.setCategory(category);
        }
        
        Note savedNote = noteRepository.save(note);
        
        // Create the first review record (stage 1, scheduled for today)
        ReviewRecord firstReview = new ReviewRecord();
        firstReview.setNote(savedNote);
        firstReview.setStageNumber(1);
        firstReview.setScheduledFor(LocalDate.now());
        reviewRecordRepository.save(firstReview);
        
        // Build response
        NoteDetailResponse response = new NoteDetailResponse();
        response.setId(savedNote.getId());
        response.setTitle(savedNote.getTitle());
        response.setContent(savedNote.getContent());
        response.setCategoryId(request.getCategoryId());
        response.setIsSupervised(savedNote.getIsSupervised());
        response.setSupervisionDurationSeconds(savedNote.getSupervisionDurationSeconds());
        response.setCreatedAt(savedNote.getCreatedAt());
        
        return response;
    }
    
    public NoteDetailResponse getNoteDetail(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Note note = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(404, "Note not found"));
        
        NoteDetailResponse response = new NoteDetailResponse();
        response.setId(note.getId());
        response.setTitle(note.getTitle());
        response.setContent(note.getContent());
        response.setIsSupervised(note.getIsSupervised());
        response.setSupervisionDurationSeconds(note.getSupervisionDurationSeconds());
        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());
        
        // Set category info
        if (note.getCategory() != null) {
            response.setCategoryId(note.getCategory().getId());
            response.setCategoryName(note.getCategory().getName());
        }
        
        // Set AI summary if exists
        aiSummaryRepository.findByNoteId(id).ifPresent(summary -> {
            AiSummaryDto summaryDto = new AiSummaryDto(
                    summary.getSummaryText(),
                    summary.getCreatedAt()
            );
            response.setAiSummary(summaryDto);
        });
        
        // Set current review record (first unreviewed)
        reviewRecordRepository.findFirstByNoteIdAndReviewedAtIsNullOrderByScheduledForAsc(id)
                .ifPresent(record -> {
                    ReviewRecordDto recordDto = new ReviewRecordDto(
                            record.getStageNumber(),
                            record.getScheduledFor()
                    );
                    response.setCurrentReviewRecord(recordDto);
                });
        
        return response;
    }
    
    @Transactional
    public NoteDetailResponse updateNote(Long id, UpdateNoteRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Note note = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(404, "Note not found"));
        
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setIsSupervised(request.getIsSupervised());
        note.setSupervisionDurationSeconds(request.getSupervisionDurationSeconds());
        
        // Update category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                    .orElseThrow(() -> new BusinessException(404, "Category not found"));
            note.setCategory(category);
        } else {
            note.setCategory(null);
        }
        
        Note updatedNote = noteRepository.save(note);
        
        NoteDetailResponse response = new NoteDetailResponse();
        response.setId(updatedNote.getId());
        response.setTitle(updatedNote.getTitle());
        response.setContent(updatedNote.getContent());
        response.setCategoryId(request.getCategoryId());
        response.setIsSupervised(updatedNote.getIsSupervised());
        response.setSupervisionDurationSeconds(updatedNote.getSupervisionDurationSeconds());
        response.setUpdatedAt(updatedNote.getUpdatedAt());
        
        return response;
    }
    
    @Transactional
    public void deleteNote(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Note note = noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(404, "Note not found"));
        
        // Cascade delete will handle AI summaries and review records
        noteRepository.delete(note);
    }
    
    public List<NoteListItemResponse> getNotesByCategory(Long categoryId) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        List<Note> notes;
        if (categoryId == null || categoryId == 0) {
            notes = noteRepository.findByUserIdAndCategoryIsNull(userId);
        } else {
            notes = noteRepository.findByUserIdAndCategoryId(userId, categoryId);
        }
        
        return notes.stream()
                .map(note -> {
                    String aiSummaryPreview = null;
                    var summaryOpt = aiSummaryRepository.findByNoteId(note.getId());
                    if (summaryOpt.isPresent()) {
                        String text = summaryOpt.get().getSummaryText();
                        if (text != null) {
                            aiSummaryPreview = text.length() > 100 ? text.substring(0, 100) + "..." : text;
                        }
                    }
                    
                    return new NoteListItemResponse(
                            note.getId(),
                            note.getTitle(),
                            note.getIsSupervised(),
                            aiSummaryPreview,
                            note.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
}

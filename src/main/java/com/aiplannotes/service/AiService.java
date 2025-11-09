package com.aiplannotes.service;

import com.aiplannotes.dto.GenerateSummaryRequest;
import com.aiplannotes.dto.SummaryResponse;
import com.aiplannotes.entity.AiSummary;
import com.aiplannotes.entity.Note;
import com.aiplannotes.exception.BusinessException;
import com.aiplannotes.repository.AiSummaryRepository;
import com.aiplannotes.repository.NoteRepository;
import com.aiplannotes.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiService {
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private AiSummaryRepository aiSummaryRepository;
    
    @Transactional
    public SummaryResponse generateSummary(GenerateSummaryRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        // Verify note exists and belongs to current user
        Note note = noteRepository.findByIdAndUserId(request.getNoteId(), userId)
                .orElseThrow(() -> new BusinessException(404, "Note not found"));
        
        // Generate mock summary (V1.0 simple implementation)
        String summaryText = generateMockSummary(note);
        String modelUsed = "mock-v1.0";
        
        // Check if AI summary already exists (update) or create new one
        AiSummary aiSummary = aiSummaryRepository.findByNoteId(request.getNoteId())
                .orElse(new AiSummary());
        
        aiSummary.setNote(note);
        aiSummary.setSummaryText(summaryText);
        aiSummary.setModelUsed(modelUsed);
        
        AiSummary savedSummary = aiSummaryRepository.save(aiSummary);
        
        return new SummaryResponse(
                savedSummary.getSummaryText(),
                savedSummary.getModelUsed(),
                savedSummary.getCreatedAt()
        );
    }
    
    /**
     * Generate a mock AI summary for V1.0
     * Extracts first 200 characters or generates a simple description
     */
    private String generateMockSummary(Note note) {
        String content = note.getContent();
        
        if (content == null || content.isEmpty()) {
            return "这是一篇关于" + note.getTitle() + "的笔记，主要内容包括...";
        }
        
        // Extract first 200 characters
        if (content.length() <= 200) {
            return content;
        }
        
        return content.substring(0, 200) + "...";
    }
}

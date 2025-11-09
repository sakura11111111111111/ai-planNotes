package com.aiplannotes.controller;

import com.aiplannotes.dto.ApiResponse;
import com.aiplannotes.dto.CreateNoteRequest;
import com.aiplannotes.dto.NoteDetailResponse;
import com.aiplannotes.dto.NoteListItemResponse;
import com.aiplannotes.dto.UpdateNoteRequest;
import com.aiplannotes.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    
    @Autowired
    private NoteService noteService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<NoteDetailResponse>> createNote(@Valid @RequestBody CreateNoteRequest request) {
        NoteDetailResponse response = noteService.createNote(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Note created successfully.", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteDetailResponse>> getNoteDetail(@PathVariable Long id) {
        NoteDetailResponse response = noteService.getNoteDetail(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteDetailResponse>> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request) {
        NoteDetailResponse response = noteService.updateNote(id, request);
        return ResponseEntity.ok(ApiResponse.success("Note updated successfully.", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteListItemResponse>>> getNotesByCategory(
            @RequestParam(required = false) Long categoryId) {
        List<NoteListItemResponse> notes = noteService.getNotesByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(notes));
    }
}

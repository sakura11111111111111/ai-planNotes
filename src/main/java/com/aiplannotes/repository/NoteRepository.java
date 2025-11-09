package com.aiplannotes.repository;

import com.aiplannotes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdAndCategoryId(Long userId, Long categoryId);
    List<Note> findByUserIdAndCategoryIsNull(Long userId);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
    boolean existsByCategoryId(Long categoryId);
}

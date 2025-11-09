package com.aiplannotes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "review_records", indexes = {
    @Index(name = "idx_scheduled_for", columnList = "scheduled_for")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;
    
    @Column(nullable = false)
    private Integer stageNumber;
    
    @Column(nullable = false)
    private LocalDate scheduledFor;
    
    private Timestamp reviewedAt;
    
    @Enumerated(EnumType.STRING)
    private ReviewResult result;
    
    private Integer reviewDurationSeconds;
    
    public enum ReviewResult {
        REMEMBERED, FUZZY, FORGOTTEN
    }
}

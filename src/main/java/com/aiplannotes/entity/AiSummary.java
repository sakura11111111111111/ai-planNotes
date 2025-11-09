package com.aiplannotes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "ai_summaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiSummary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", unique = true, nullable = false)
    private Note note;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String summaryText;
    
    @Column(length = 50)
    private String modelUsed;
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;
}

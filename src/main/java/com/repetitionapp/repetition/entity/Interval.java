package com.repetitionapp.repetition.entity;

import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "interval")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_level")
    @Enumerated(EnumType.STRING)
    private ReviewLevel reviewLevel;


    @Column(name = "last_reviewed")
    private LocalDateTime lastReviewed;

    @Column(name = "next_review")
    private LocalDateTime nextReview;

    @PrePersist
    public void setNextReviewBeforeSave() {
        if (lastReviewed == null) {
            lastReviewed = LocalDateTime.now();
        }
        if (reviewLevel != null) {
            nextReview = lastReviewed.plus(reviewLevel.getDuration());
        }
    }
}
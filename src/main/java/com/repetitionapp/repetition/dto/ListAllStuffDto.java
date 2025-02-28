package com.repetitionapp.repetition.dto;

import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ListAllStuffDto {
    private String name;
    private ReviewLevel reviewLevel;
    private LocalDateTime lastReviewed;
    private LocalDateTime nextReview;
}

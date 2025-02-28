package com.repetitionapp.repetition.dto;

import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RepetitionDto {
    private String name;
    private ReviewLevel reviewLevel;
}



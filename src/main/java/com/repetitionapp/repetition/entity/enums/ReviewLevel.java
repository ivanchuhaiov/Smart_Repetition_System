package com.repetitionapp.repetition.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Duration;

@Getter
@AllArgsConstructor
public enum ReviewLevel {
    LEVEL_1(Duration.ofMinutes(30)),
    LEVEL_2(Duration.ofHours(1)),
    LEVEL_3(Duration.ofHours(8)),
    LEVEL_4(Duration.ofDays(1)),
    LEVEL_5(Duration.ofDays(3)),
    LEVEL_6(Duration.ofDays(7)),
    LEVEL_7(Duration.ofDays(14)),
    LEVEL_8(Duration.ofDays(30));

    private final Duration duration;

}


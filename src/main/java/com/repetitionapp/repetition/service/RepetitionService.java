package com.repetitionapp.repetition.service;

import com.repetitionapp.repetition.dto.ListAllStuffDto;
import com.repetitionapp.repetition.dto.RepetitionDto;
import com.repetitionapp.repetition.entity.Repetition;
import com.repetitionapp.repetition.entity.enums.ReviewLevel;

import java.util.List;

public interface RepetitionService {
    Repetition createRepetition(RepetitionDto dto);

    Repetition updateRepetition(String name, ReviewLevel newLevel);

    List<ListAllStuffDto> getListAllStuff();

}

package com.repetitionapp.repetition.service;

import com.repetitionapp.repetition.dto.ListAllStuffDto;
import com.repetitionapp.repetition.dto.RepetitionDto;
import com.repetitionapp.repetition.entity.Interval;
import com.repetitionapp.repetition.entity.Repetition;
import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import com.repetitionapp.repetition.repository.IntervalRepository;
import com.repetitionapp.repetition.repository.RepetitionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class RepetitionServiceImpl implements RepetitionService {

    private final RepetitionRepository repetitionRepository;
    private final IntervalRepository intervalRepository;

    @Override
    public Repetition createRepetition(RepetitionDto repetitionDto) {
        Interval interval = Interval.builder()
                .reviewLevel(repetitionDto.getReviewLevel())
                .lastReviewed(LocalDateTime.now())
                .nextReview(LocalDateTime.now().plus(repetitionDto.getReviewLevel().getDuration()))
                .build();

        intervalRepository.save(interval);

        Repetition repetition = Repetition.builder()
                .name(repetitionDto.getName())
                .intervalId(interval)
                .build();

        return repetitionRepository.save(repetition);
    }

    @Override
    public Repetition updateRepetition(String name, ReviewLevel newLevel) {
        Repetition repetition = repetitionRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Repetition " + name + " don't exist"));
        Interval updatedInterval = Interval.builder()
                .id(repetition.getIntervalId().getId())
                .reviewLevel(newLevel)
                .lastReviewed(LocalDateTime.now())
                .nextReview(LocalDateTime.now().plus(newLevel.getDuration()))
                .build();

        intervalRepository.save(updatedInterval);
        return repetition;
    }

    @Override
    public List<ListAllStuffDto> getListAllStuff() {
        List<Repetition> repetitions = repetitionRepository.findAll();
        List<ListAllStuffDto> listAllStuff = new ArrayList<>();
        for (Repetition repetition : repetitions) {
            ListAllStuffDto allStuffDto = ListAllStuffDto.builder()
                    .name(repetition.getName())
                    .reviewLevel(repetition.getIntervalId().getReviewLevel())
                    .lastReviewed(repetition.getIntervalId().getLastReviewed())
                    .nextReview(repetition.getIntervalId().getNextReview())
                    .build();
            listAllStuff.add(allStuffDto);
        }
        return listAllStuff;
    }



}

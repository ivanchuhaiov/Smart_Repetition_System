package com.repetitionapp.repetition.controller;


import com.repetitionapp.repetition.dto.ListAllStuffDto;
import com.repetitionapp.repetition.dto.RepetitionDto;
import com.repetitionapp.repetition.entity.Interval;
import com.repetitionapp.repetition.entity.Repetition;
import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import com.repetitionapp.repetition.service.RepetitionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repetition")
@AllArgsConstructor
public class IntervalController {

    private final RepetitionService repetitionService;


    @PostMapping("/repetition")
    public ResponseEntity<Repetition> createRepetition(@RequestBody  RepetitionDto repetitionDto) {
        return ResponseEntity.ok(repetitionService.createRepetition(repetitionDto));
    }

    @PutMapping("/update")
    public Repetition updateRepetition(@RequestParam String name, @RequestParam ReviewLevel newLevel) {
        return repetitionService.updateRepetition(name, newLevel);
    }

    @GetMapping("/all")
    public List<ListAllStuffDto> getAllRepetitions() {
        return repetitionService.getListAllStuff();
    }



}

package com.repetitionapp.repetition.repository;

import com.repetitionapp.repetition.entity.Interval;
import com.repetitionapp.repetition.entity.Repetition;
import com.repetitionapp.repetition.entity.enums.ReviewLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface IntervalRepository extends JpaRepository<Interval, Long> {
}

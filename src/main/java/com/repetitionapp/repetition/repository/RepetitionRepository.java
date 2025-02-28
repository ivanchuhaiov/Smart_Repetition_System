package com.repetitionapp.repetition.repository;

import com.repetitionapp.repetition.entity.Repetition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepetitionRepository extends JpaRepository<Repetition, Integer> {
    Optional<Repetition> findByName(String name);


}

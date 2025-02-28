package com.repetitionapp.repetition.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "repetition")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Repetition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "interval_id")
    private Interval intervalId;




}

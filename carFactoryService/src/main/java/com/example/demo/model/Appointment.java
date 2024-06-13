package com.example.demo.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Customer customer;
    @ManyToOne
    private Employee employee;
    @ManyToOne
    private ServiceBeuaty serviceBeuaty;
    private LocalDate date;
    private LocalTime time;
    @Schema(type = "string", format = "duration")
    private Duration duration;
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    private String note;
}
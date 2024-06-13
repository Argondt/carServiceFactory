package com.example.demo.model.dto;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentUpdate(

        LocalDate date,
        LocalTime time,
        Duration duration,
        String note
) {

}

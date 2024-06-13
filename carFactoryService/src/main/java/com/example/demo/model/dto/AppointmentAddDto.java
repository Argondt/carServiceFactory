package com.example.demo.model.dto;

import com.example.demo.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentAddDto(
        Long customerId,
        Long employeeId,
        Long serviceId,
        LocalDate date,
        LocalTime time,
        AppointmentStatus appointmentStatus

) {
}

package com.example.demo.model.dto;

public record AppointmentReportDTO(
        String customerName,
        String customerPhoneNumber,
        String serviceName,
        String serviceDuration,
        String serviceTime
) {}

package com.example.demo.model.dto;

public record EmployeeRegisterDTO(
        Long id,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        String userId
) {
}

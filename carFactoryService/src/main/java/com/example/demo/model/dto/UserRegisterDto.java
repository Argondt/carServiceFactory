package com.example.demo.model.dto;

import java.util.List;

public record UserRegisterDto(
        String username,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        List<String> roles

) {
}

package com.example.demo.model.dto;

import lombok.Builder;
import org.springframework.context.annotation.Bean;

import java.time.LocalTime;

@Builder
public record EmailMessageDto(
        String email,
        EmailType type,
        String message
) {
}

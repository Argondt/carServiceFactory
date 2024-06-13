package com.example.demo.model.dto;

import lombok.Builder;

@Builder
public record EmailTemplateMessageDto(
        String email,
        String time,
        String serviceName,
        String employeeName,
        String employeeSurname
) {
}

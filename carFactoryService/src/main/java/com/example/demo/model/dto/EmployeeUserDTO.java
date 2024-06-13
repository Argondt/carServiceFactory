package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class EmployeeUserDTO{
        Long id;
        Long serviceId;
        String email;

}

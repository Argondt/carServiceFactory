package com.example.demo.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonPropertyOrder({"id", "employee", "availableHours"})
@Getter
@Setter
public class AvailableDate {

    private Long id;
    @JsonProperty("employee")
    private EmployeeDTO employeeDTO;
    private List<LocalTime> availableHours;

    public AvailableDate(EmployeeDTO employeeDTO, List<LocalTime> availableHours) {
        this.employeeDTO = employeeDTO;
        this.availableHours = availableHours;
    }

}

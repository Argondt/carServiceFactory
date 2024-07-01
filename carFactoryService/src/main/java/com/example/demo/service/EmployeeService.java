package com.example.demo.service;

import com.example.demo.model.Employee;
import com.example.demo.model.dto.EmployeeDTO;
import com.example.demo.model.dto.EmployeeRegisterDTO;
import com.example.demo.model.dto.EmployeeUserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.Set;

public interface EmployeeService {
    Optional<Employee> getEmployeeById(Long id);

    Optional<EmployeeUserDTO> getEmployeeByUserId(String id);

    Page<Employee> getEmployees(Pageable pageable);

    ResponseEntity<Employee> getEmployee(Long id);

    Optional<Employee> createEmployee(EmployeeRegisterDTO employee);

    Employee assignServiceToEmployee(Long employeeId, Long serviceId);

    Employee addServiceBeuatyToEmployee(Long employeeId, Set<Long> serviceBeuatyIds);

    Employee removeServiceBeuatyFromEmployee(Long employeeId, Set<Long> serviceBeuatyIds);


}

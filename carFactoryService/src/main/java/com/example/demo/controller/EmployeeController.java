package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.model.dto.EmployeeDTO;
import com.example.demo.model.dto.EmployeeRegisterDTO;
import com.example.demo.model.dto.EmployeeUserDTO;
import com.example.demo.service.EmployeeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;


@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/employees")
@Slf4j
public class EmployeeController {

    private EmployeeService employeeService;

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return ResponseEntity.of(employeeService.getEmployeeById(id));
    }
    @GetMapping("/users/{userId}")
    public ResponseEntity<EmployeeUserDTO> getEmployeeByUserId(@PathVariable String userId) {
        Optional<EmployeeUserDTO> employeeUserDTO = employeeService.getEmployeeByUserId(userId);
        return ResponseEntity.of(employeeUserDTO);
    }

    @PostMapping()
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeRegisterDTO employee) {
        return ResponseEntity.of(employeeService.createEmployee(employee));
    }

    @GetMapping()
    public Page<Employee> getEmployees(@RequestParam(required = false) Integer pageNumber,
                                       @RequestParam(required = false) Integer pageSize) {
        Pageable pageable = (pageNumber != null && pageSize != null) ? PageRequest.of(pageNumber, pageSize) : Pageable.unpaged();
        return employeeService.getEmployees(pageable);
    }
    @PostMapping("/{employeeId}/services/{serviceId}")
    public Employee assignServiceToEmployee(@PathVariable Long employeeId, @PathVariable Long serviceId) {
        return employeeService.assignServiceToEmployee(employeeId, serviceId);
    }
    @PostMapping("/{employeeId}/serviceBeuaties")
    public ResponseEntity<Employee> addServiceBeuatyToEmployee(@PathVariable Long employeeId, @RequestBody Set<Long> serviceBeuatyIds) {
        Employee updatedEmployee = employeeService.addServiceBeuatyToEmployee(employeeId, serviceBeuatyIds);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{employeeId}/serviceBeuaties")
    public ResponseEntity<Employee> removeServiceBeuatyFromEmployee(@PathVariable Long employeeId, @RequestBody Set<Long> serviceBeuatyIds) {
        Employee updatedEmployee = employeeService.removeServiceBeuatyFromEmployee(employeeId, serviceBeuatyIds);
        return ResponseEntity.ok(updatedEmployee);
    }

}

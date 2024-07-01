package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Employee;
import com.example.demo.model.ServiceBeuaty;
import com.example.demo.model.dto.EmployeeDTO;
import com.example.demo.model.dto.EmployeeRegisterDTO;
import com.example.demo.model.dto.EmployeeUserDTO;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ServiceRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public Optional<EmployeeUserDTO> getEmployeeByUserId(String id) {
        return employeeRepository.findByUserId(id)
                .map(employee -> {
                    // Sprawdź, czy serviceBeauties nie jest pusty
                    Optional<ServiceBeuaty> firstService = employee.getServiceBeuaties().stream().findFirst();
                    Long serviceId = firstService.map(ServiceBeuaty::getId).orElse(null);
                    EmployeeUserDTO employeeDTO = new EmployeeUserDTO();
                    employeeDTO.setServiceId(serviceId);
                    employeeDTO.setId(employee.getId());
                    employeeDTO.setEmail(employee.getEmail());

                    // Zbuduj DTO
                    return employeeDTO;
                });
    }

    @Override
    public Page<Employee> getEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    @Override
    public ResponseEntity<Employee> getEmployee(Long id) {
        return null;
    }

    @Override
    public Optional<Employee> createEmployee(EmployeeRegisterDTO employee) {
        Employee build = Employee.builder()
                .phoneNumber(employee.phoneNumber())
                .firstName(employee.firstName())
                .serviceBeuaties(new HashSet<>(serviceRepository.findAll()))
                .lastName(employee.lastName())
                .userId(employee.userId())
                .email(employee.email())
                .build();

        return Optional.of(employeeRepository.save(build));
    }

    @Override
    public Employee assignServiceToEmployee(Long employeeId, Long serviceId) {
        Optional<Employee> employeeOptional = employeeRepository.findById(employeeId);
        Optional<ServiceBeuaty> serviceBeuatyOptional = serviceRepository.findById(serviceId);

        if (employeeOptional.isPresent() && serviceBeuatyOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            ServiceBeuaty serviceBeuaty = serviceBeuatyOptional.get();
            employee.getServiceBeuaties().add(serviceBeuaty);
            return employeeRepository.save(employee);
        } else {
            throw new RuntimeException("Employee or Service not found");
        }
    }

    @Override
    public Employee addServiceBeuatyToEmployee(Long employeeId, Set<Long> serviceBeuatyIds) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        Set<ServiceBeuaty> serviceBeuaties = new HashSet<>(serviceRepository.findAllById(serviceBeuatyIds));
        employee.getServiceBeuaties().addAll(serviceBeuaties);
        return employeeRepository.save(employee);
    }

    @Override
    public Employee removeServiceBeuatyFromEmployee(Long employeeId, Set<Long> serviceBeuatyIds) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        Set<ServiceBeuaty> serviceBeuaties = new HashSet<>(serviceRepository.findAllById(serviceBeuatyIds));
        employee.getServiceBeuaties().removeAll(serviceBeuaties);
        return employeeRepository.save(employee);
    }
}
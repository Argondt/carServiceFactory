package com.example.demo;

import com.example.demo.model.Employee;
import com.example.demo.model.ServiceBeuaty;
import com.example.demo.model.dto.EmployeeRegisterDTO;
import com.example.demo.model.dto.EmployeeUserDTO;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnEmployeeById() {
        // given
        Long id = 1L;
        Employee employee = new Employee();
        when(employeeRepository.findById(id)).thenReturn(Optional.of(employee));

        // when
        Optional<Employee> result = employeeService.getEmployeeById(id);

        // then
        assertTrue(result.isPresent());
        assertEquals(employee, result.get());
        verify(employeeRepository, times(1)).findById(id);
    }

    @Test
    void shouldReturnEmployeeByUserId() {
        // given
        String userId = "user123";
        Employee employee = new Employee();
        ServiceBeuaty serviceBeuaty = new ServiceBeuaty();
        serviceBeuaty.setId(1L);
        employee.setServiceBeuaties(new HashSet<>(List.of(serviceBeuaty)));
        when(employeeRepository.findByUserId(userId)).thenReturn(Optional.of(employee));

        // when
        Optional<EmployeeUserDTO> result = employeeService.getEmployeeByUserId(userId);

        // then
        assertTrue(result.isPresent());
        assertEquals(serviceBeuaty.getId(), result.get().getServiceId());
        verify(employeeRepository, times(1)).findByUserId(userId);
    }

    @Test
    void shouldReturnEmployeesPage() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        Employee employee = new Employee();
        Page<Employee> page = new PageImpl<>(List.of(employee));
        when(employeeRepository.findAll(pageable)).thenReturn(page);

        // when
        Page<Employee> result = employeeService.getEmployees(pageable);

        // then
        assertEquals(1, result.getTotalElements());
        verify(employeeRepository, times(1)).findAll(pageable);
    }

    @Test
    void shouldCreateEmployee() {
        // given
        EmployeeRegisterDTO employeeRegisterDTO = new EmployeeRegisterDTO(1L,"firstName", "lastName", "email", "userId", "phoneNumber");
        Employee employee = Employee.builder()
                .firstName("firstName")
                .lastName("lastName")
                .email("email")
                .userId("userId")
                .phoneNumber("phoneNumber")
                .serviceBeuaties(new HashSet<>())
                .build();
        when(serviceRepository.findAll()).thenReturn(List.of());
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        // when
        Optional<Employee> result = employeeService.createEmployee(employeeRegisterDTO);

        // then
        assertTrue(result.isPresent());
        assertEquals(employee, result.get());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }
}

package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.model.dto.AppointmentAddDto;
import com.example.demo.model.dto.EmailMessageDto;
import com.example.demo.repository.*;
import com.example.demo.service.AppointmentServiceImpl;
import com.example.demo.service.RabbitMQSender;
import com.example.demo.service.ServiceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private ServiceService serviceService;

    @Mock
    private RabbitMQSender rabbitMQSender;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldAddNewAppointment() {
        // given
        AppointmentAddDto appointmentAddDto = new AppointmentAddDto(
                1L, 1L, 1L, LocalDate.now(), LocalTime.now(), AppointmentStatus.APPOINTED
        );
        Employee employee = new Employee();
        Customer customer = new Customer();
        ServiceBeuaty serviceBeuaty = new ServiceBeuaty();
        serviceBeuaty.setDuration(java.time.Duration.ofHours(1));
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(serviceBeuaty));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(new Appointment());

        // when
        Optional<Appointment> result = appointmentService.addNewAppointment(appointmentAddDto);

        // then
        assertTrue(result.isPresent());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
        verify(rabbitMQSender, times(1)).send(any(EmailMessageDto.class));
    }

    @Test
    void shouldGetAppointments() {
        // given
        List<Appointment> appointments = List.of(new Appointment());
        when(appointmentRepository.findAll()).thenReturn(appointments);

        // when
        List<Appointment> result = appointmentService.getAppointments();

        // then
        assertEquals(appointments, result);
        verify(appointmentRepository, times(1)).findAll();
    }

    @Test
    void shouldCancelAppointment() {
        // given
        Long id = 1L;
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.REJECTED);
        when(appointmentRepository.findById(id)).thenReturn(Optional.of(appointment));

        // when
        Optional<Appointment> result = appointmentService.cancelAppointment(id);

        // then
        assertTrue(result.isPresent());
        assertEquals(AppointmentStatus.REJECTED, result.get().getStatus());
        verify(appointmentRepository, times(1)).findById(id);
    }

    @Test
    void shouldRealizeAppointment() {
        // given
        Long id = 1L;
        Appointment appointment = new Appointment();
        when(appointmentRepository.findById(id)).thenReturn(Optional.of(appointment));

        // when
        Optional<Appointment> result = appointmentService.realizeAppointment(id);

        // then
        assertTrue(result.isPresent());
        assertEquals(AppointmentStatus.DONE, result.get().getStatus());
        verify(appointmentRepository, times(1)).findById(id);
    }
}

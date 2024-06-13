package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.model.dto.*;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ServiceRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@org.springframework.stereotype.Service
@AllArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private static final LocalTime START_TIME = LocalTime.of(8, 0);
    private static final LocalTime END_TIME = LocalTime.of(16, 0);


    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceService serviceService;
    private final RabbitMQSender rabbitMQSender;


    @Override
    public Optional<Appointment> addNewAppointment(AppointmentAddDto appointmentdto) {
        System.out.println(appointmentdto);
        Optional<Employee> optionalEmployee = getEmployee(appointmentdto);
        Optional<Customer> optionalCustomer = getCustomer(appointmentdto);
        Optional<ServiceBeuaty> serviceBeuaty = getServiceBeuaty(appointmentdto);

        if (optionalCustomer.isEmpty()) {
            optionalCustomer = Optional.ofNullable(customerRepository.findByPhoneNumber(String.valueOf(appointmentdto.customerId())));
        }
        Appointment build = Appointment.builder()
                .status(appointmentdto.appointmentStatus())
                .duration(serviceBeuaty.get().getDuration())
                .date(appointmentdto.date())
                .customer(optionalCustomer.get())
                .employee(optionalEmployee.get())
                .serviceBeuaty(serviceBeuaty.get()).time(appointmentdto.time())
                .build();
        System.out.println(appointmentdto.time());
        System.out.println(optionalCustomer.get().getEmail());
        Appointment save = appointmentRepository.save(build);
        EmailMessageDto emailMessageDto = EmailService.createEmail(build, optionalEmployee, optionalCustomer, serviceBeuaty, EmailType.POTWIERDZENIE_REZERWACJI);
        rabbitMQSender.send(emailMessageDto);
        return Optional.of(save);
    }

    private Optional<Employee> getEmployee(AppointmentAddDto appointmentdto) {
        return employeeRepository.findById(appointmentdto.employeeId());
    }
    private Optional<Customer> getCustomer(AppointmentAddDto appointmentdto) {
        return customerRepository.findById(appointmentdto.customerId());
    }
    private Optional<ServiceBeuaty> getServiceBeuaty(AppointmentAddDto appointmentdto) {
        Optional<ServiceBeuaty> serviceBeuaty = serviceRepository.findById(appointmentdto.serviceId());
        return serviceBeuaty;
    }

    @Scheduled(fixedRate = 3600000) // Co godzinę
    public void sendEmailReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Appointment> appointments = getAppointments();
        for (Appointment appointment : appointments) {
            LocalDateTime appointmentDateTime = LocalDateTime.of(appointment.getDate(), appointment.getTime());
            if (appointmentDateTime.isAfter(now) && appointmentDateTime.minusHours(24).isBefore(now)) {
                EmailMessageDto emailMessageDto = EmailService.createEmail(appointment, Optional.ofNullable(appointment.getEmployee()), Optional.ofNullable(appointment.getCustomer()), Optional.ofNullable(appointment.getServiceBeuaty()), EmailType.PRZYPOMNIENIE_WIZYTY24H);
                rabbitMQSender.send(emailMessageDto);
            } else if (appointmentDateTime.isAfter(now) && appointmentDateTime.minusHours(1).isBefore(now)) {
                EmailMessageDto emailMessageDto = EmailService.createEmail(appointment, Optional.ofNullable(appointment.getEmployee()), Optional.ofNullable(appointment.getCustomer()), Optional.ofNullable(appointment.getServiceBeuaty()), EmailType.PRZYPOMNIENIE_WIZYTY1H);
                rabbitMQSender.send(emailMessageDto);
            }
        }
    }


    @Override
    public Optional<Appointment> addAbsence(Appointment appointment) {
        appointment.setServiceBeuaty(null);
        appointment.setCustomer(null);
        return Optional.of(appointmentRepository.save(appointment));
    }


    @Override
    public Optional<Appointment> updateAppointment(Long id, AppointmentUpdate appointmentUpdate) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        if (appointmentUpdate.note() != null) {
            appointment.setNote(appointmentUpdate.note());
        }
        return Optional.of(appointmentRepository.save(appointment));
    }

    @Override
    public List<Appointment> getAppointments(Long idEmployee) {
        return appointmentRepository.findFutureAppointmentsByIdEmployee(idEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> getAppointments(Employee employee, LocalDate date) {
        return appointmentRepository.findActualAppointmentsByEmployeeAndDate(employee, date);
    }

    @Override
    @Transactional
    public Optional<Appointment> cancelAppointment(Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        appointment.ifPresent(app -> {
            if (!app.getStatus().equals(AppointmentStatus.ABSENCE)) {
                app.setStatus(AppointmentStatus.REJECTED);
            } else
                appointmentRepository.delete(app);
        });
        return appointment;
    }

    @Override
    @Transactional
    public Optional<Appointment> realizeAppointment(Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        appointment.ifPresent(app -> app.setStatus(AppointmentStatus.DONE));
        return appointment;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> getPastAppointmentsForCustomer(Long id) {
        return appointmentRepository.findPastAppointmentsByIdCustomer(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> getFutureAppointmentsForCustomer(Long id) {
        return appointmentRepository.findFutureAppointmentsByIdCustomer(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Appointment> getAppointment(Long id) {
        return appointmentRepository.findById(id);
    }

    private List<LocalTime> getAvailableHoursList() {
        List<LocalTime> availableHours = new ArrayList<>();
        LocalTime timeToAdd = START_TIME;
        do {
            availableHours.add(timeToAdd);
            timeToAdd = timeToAdd.plusMinutes(30);
        } while (!availableHours.contains(END_TIME.minusMinutes(30)));
        return availableHours;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableDate> getAvailableDates(Long serviceId, LocalDate date) {
        ServiceBeuaty service = serviceService.getService(serviceId)
                .orElseThrow(NoSuchElementException::new);

        List<Employee> employees = employeeRepository.findAllByServiceId(serviceId);

        return employees.stream()
                .map(employee -> {
                    List<Appointment> appointments = getAppointments(employee, date);
                    List<LocalTime> availableHours = getAvailableHoursList();
                    removeBusyHours(availableHours, appointments);
                    removeTooShortHours(availableHours, service.getDuration());
                    return new AvailableDate(new EmployeeDTO(employee.getId(), employee.getFirstName(), employee.getLastName()), availableHours);
                })
                .toList();
    }

    private void removeBusyHours(List<LocalTime> hours, List<Appointment> appointments) {
        for (Appointment appointment : appointments) {
            LocalTime time = appointment.getTime();
            do {
                hours.remove(time);
                time = time.plusMinutes(30);
            } while (time.isBefore(appointment.getTime().plus(appointment.getDuration())));
        }
    }

    private void removeTooShortHours(List<LocalTime> hours, Duration serviceDuration) {
        List<LocalTime> tempHours = new ArrayList<>(hours);

        for (LocalTime tempHour : tempHours) {
            boolean toRemove = false;
            LocalTime time = tempHour;
            do {
                if (!hours.contains(time)) {
                    log.debug("To remove: " + tempHour + " cause " + time);
                    toRemove = true;
                }
                time = time.plusMinutes(30);
            } while (time.isBefore(tempHour.plus(serviceDuration)));
            if (toRemove) hours.remove(tempHour);
        }
    }

}

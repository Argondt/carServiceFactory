package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.Employee;
import com.example.demo.model.dto.AppointmentAddDto;
import com.example.demo.model.dto.AppointmentUpdate;
import com.example.demo.model.dto.AvailableDate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    List<Appointment> getAppointments(Employee employee, LocalDate date);

    List<Appointment> getAppointments();

    List<Appointment> getPastAppointmentsForCustomer(Long id);

    List<Appointment> getFutureAppointmentsForCustomer(Long id);

    Optional<Appointment> getAppointment(Long id);

    Optional<Appointment> cancelAppointment(Long id);

    Optional<Appointment> realizeAppointment(Long id);

    List<AvailableDate> getAvailableDates(Long serviceId, LocalDate date);

    Optional<Appointment> addNewAppointment(AppointmentAddDto appointment);
    Optional<Appointment> addAbsence(Appointment appointment);

    Optional<Appointment> updateAppointment(Long id, AppointmentUpdate appointment);

    List<Appointment> getAppointments(Long idEmployee);
}

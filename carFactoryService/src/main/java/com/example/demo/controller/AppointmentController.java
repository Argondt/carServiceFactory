package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.model.Employee;
import com.example.demo.model.dto.AppointmentAddDto;
import com.example.demo.model.dto.AvailableDate;
import com.example.demo.service.AppointmentService;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.JasperService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final EmployeeService employeeService;
    private final JasperService service;


    @GetMapping("/available-dates")
    public List<AvailableDate> getAvailableDates(@RequestParam Long serviceId,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAvailableDates(serviceId, date);
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments(@RequestParam(required = false) Long idEmployee,
                                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (idEmployee != null && date != null) {
            Employee employee = employeeService.getEmployeeById(idEmployee).orElseThrow(NoSuchElementException::new);
            return appointmentService.getAppointments(employee, date);
        }
        return appointmentService.getAppointments();
    }

    @GetMapping("/futureAppointments/{idEmployee}")
    public List<Appointment> getFutureAppointmentsForEmployee(@PathVariable Long idEmployee) {
        return appointmentService.getAppointments(idEmployee);
    }
    @PostMapping("/appointments/report/{id}")
    public ResponseEntity<?> getReport(@PathVariable Long id) throws JRException, IOException {

        byte[] body = service.generateReport(id);
        System.out.println(Arrays.toString(body));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=bardcode.pdf")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(body);
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.of(appointmentService.getAppointment(id));
    }


    @PostMapping("/appointments")
    public ResponseEntity<Appointment> addNewAppointment(@RequestBody AppointmentAddDto appointment) {
        return ResponseEntity.of(appointmentService.addNewAppointment(appointment));
    }

    @PostMapping("/appointments/absence")
    public ResponseEntity<Appointment> addNewAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.of(appointmentService.addAbsence(appointment));
    }


    @GetMapping("/clientAppointments/{customerId}")
    public ResponseEntity<List<Appointment>> getClientAppointments(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.getFutureAppointmentsForCustomer(customerId));
    }

    @GetMapping("/historyAppointments/{customerId}")
    public ResponseEntity<List<Appointment>> getAppointmentsHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.getPastAppointmentsForCustomer(customerId));
    }

    @GetMapping("/cancelAppointment/{id}")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.of(appointmentService.cancelAppointment(id));
    }

    @GetMapping("/realizeAppointment/{id}")
    public ResponseEntity<Appointment> realizeAppointment(@PathVariable Long id) {
        return ResponseEntity.of(appointmentService.realizeAppointment(id));
    }
}
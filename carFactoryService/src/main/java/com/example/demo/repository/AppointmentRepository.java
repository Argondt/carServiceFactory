package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("Select a from Appointment a where a.employee = :employee and a.date = :date and a.status <> 'REJECTED'")
    List<Appointment> findActualAppointmentsByEmployeeAndDate(@Param("employee") Employee employee, @Param("date") LocalDate date);

    List<Appointment> findAppointmentsByEmployeeAndDate(Employee employee, LocalDate date);

    @Query("Select a from Appointment a where a.customer.id = :idCustomer and a.status <> 'APPOINTED' and a.status <> 'ABSENCE'")
    List<Appointment> findPastAppointmentsByIdCustomer(@Param("idCustomer") Long idCustomer);

    @Query("Select a from Appointment a where a.customer.id = :idCustomer and a.status = 'APPOINTED'")
    List<Appointment> findFutureAppointmentsByIdCustomer(@Param("idCustomer") Long idCustomer);

    @Query("Select a from Appointment a where a.employee.id = :idEmployee and (a.status = 'APPOINTED' or a.status = 'ABSENCE') and a.date > current_date")
    List<Appointment> findFutureAppointmentsByIdEmployee(@Param("idEmployee") Long idEmployee);
}

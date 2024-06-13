package com.example.demo.repository;

import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e FROM Employee e JOIN e.serviceBeuaties s WHERE s.id = :serviceId ")
    List<Employee> findAllByServiceId(@Param("serviceId") Long serviceId);
    Optional<Employee> findByUserId(String userId);
}

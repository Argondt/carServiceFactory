package com.example.demo.repository;

import com.example.demo.model.ServiceBeuaty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceBeuaty, Long> {
}

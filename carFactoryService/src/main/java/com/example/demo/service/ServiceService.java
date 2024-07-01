package com.example.demo.service;

import com.example.demo.model.ServiceBeuaty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface ServiceService {

    Page<ServiceBeuaty> getServices(Pageable pageable);

    Optional<ServiceBeuaty> getService(Long id);

    Optional<ServiceBeuaty> addService(ServiceBeuaty serviceBeuaty);
    void deleteById(Long id);
}

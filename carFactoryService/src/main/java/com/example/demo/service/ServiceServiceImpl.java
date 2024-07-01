package com.example.demo.service;

import com.example.demo.model.ServiceBeuaty;
import com.example.demo.repository.ServiceRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
@AllArgsConstructor
@Service
@Slf4j
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    @Override
    public Page<ServiceBeuaty> getServices(Pageable pageable) {
        return serviceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceBeuaty> getService(Long id) {
        return serviceRepository.findById(id);
    }

    @Override
    public Optional<ServiceBeuaty> addService(ServiceBeuaty serviceBeuaty) {
        ServiceBeuaty savedServiceBeuaty = serviceRepository.save(serviceBeuaty);
        return Optional.of(savedServiceBeuaty);
    }
    @Override
    public void deleteById(Long id) {
        serviceRepository.deleteById(id);
    }

}

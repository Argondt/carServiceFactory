package com.example.demo;

import com.example.demo.model.ServiceBeuaty;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.service.ServiceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ServiceServiceImplTest {

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private ServiceServiceImpl serviceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnServicesPage() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        ServiceBeuaty serviceBeuaty = new ServiceBeuaty();
        Page<ServiceBeuaty> page = new PageImpl<>(List.of(serviceBeuaty));
        when(serviceRepository.findAll(pageable)).thenReturn(page);

        // when
        Page<ServiceBeuaty> result = serviceService.getServices(pageable);

        // then
        assertEquals(1, result.getTotalElements());
        verify(serviceRepository, times(1)).findAll(pageable);
    }

    @Test
    void shouldReturnServiceById() {
        // given
        Long id = 1L;
        ServiceBeuaty serviceBeuaty = new ServiceBeuaty();
        when(serviceRepository.findById(id)).thenReturn(Optional.of(serviceBeuaty));

        // when
        Optional<ServiceBeuaty> result = serviceService.getService(id);

        // then
        assertTrue(result.isPresent());
        assertEquals(serviceBeuaty, result.get());
        verify(serviceRepository, times(1)).findById(id);
    }

    @Test
    void shouldAddService() {
        // given
        ServiceBeuaty serviceBeuaty = new ServiceBeuaty();
        when(serviceRepository.save(any(ServiceBeuaty.class))).thenReturn(serviceBeuaty);

        // when
        Optional<ServiceBeuaty> result = serviceService.addService(serviceBeuaty);

        // then
        assertTrue(result.isPresent());
        assertEquals(serviceBeuaty, result.get());
        verify(serviceRepository, times(1)).save(serviceBeuaty);
    }
}

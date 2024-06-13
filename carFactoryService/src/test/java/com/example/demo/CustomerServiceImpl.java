package com.example.demo;


import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.service.CustomerServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnCustomersPage() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        Customer customer = new Customer();
        Page<Customer> page = new PageImpl<>(List.of(customer));
        when(customerRepository.findAll(pageable)).thenReturn(page);

        // when
        Page<Customer> result = customerService.getCustomers(pageable);

        // then
        assertEquals(1, result.getTotalElements());
        verify(customerRepository, times(1)).findAll(pageable);
    }

    @Test
    void shouldCreateCustomer() {
        // given
        Customer customer = new Customer();
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        // when
        Optional<Customer> result = customerService.createCustomer(customer);

        // then
        assertTrue(result.isPresent());
        assertEquals(customer, result.get());
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void shouldReturnCustomerByPhoneNumber() {
        // given
        String phoneNumber = "123456789";
        Customer customer = new Customer();
        when(customerRepository.findByPhoneNumber(phoneNumber)).thenReturn(customer);

        // when
        Optional<Customer> result = customerService.getCustomerByPhoneNumber(phoneNumber);

        // then
        assertTrue(result.isPresent());
        assertEquals(customer, result.get());
        verify(customerRepository, times(1)).findByPhoneNumber(phoneNumber);
    }

    @Test
    void shouldReturnCustomerById() {
        // given
        Long id = 1L;
        Customer customer = new Customer();
        when(customerRepository.findById(id)).thenReturn(Optional.of(customer));

        // when
        Optional<Customer> result = customerService.getCustomerById(id);

        // then
        assertTrue(result.isPresent());
        assertEquals(customer, result.get());
        verify(customerRepository, times(1)).findById(id);
    }

    @Test
    void shouldUpdateCustomer() {
        // given
        Long id = 1L;
        Customer existingCustomer = new Customer();
        existingCustomer.setFirstName("OldFirstName");
        Customer updatedCustomer = new Customer();
        updatedCustomer.setFirstName("NewFirstName");
        when(customerRepository.findById(id)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(existingCustomer)).thenReturn(existingCustomer);

        // when
        Optional<Customer> result = customerService.updateCustomer(id, updatedCustomer);

        // then
        assertTrue(result.isPresent());
        assertEquals("NewFirstName", result.get().getFirstName());
        verify(customerRepository, times(1)).findById(id);
        verify(customerRepository, times(1)).save(existingCustomer);
    }
}

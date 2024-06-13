package com.example.demo.service;

import com.example.demo.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface CustomerService {

    Page<Customer> getCustomers(Pageable pageable);

    Optional<Customer> createCustomer(Customer customer);

    Optional<Customer> getCustomerByPhoneNumber(String phoneNumber);

    Optional<Customer> getCustomerById(Long id);

    Optional<Customer> updateCustomer(Long id, Customer customer);
}

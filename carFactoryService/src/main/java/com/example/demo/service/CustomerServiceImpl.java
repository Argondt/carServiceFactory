package com.example.demo.service;

import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Page<Customer> getCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Optional<Customer> createCustomer(Customer customer) {
        return Optional.of(customerRepository.save(customer));
    }

    @Override
    public Optional<Customer> getCustomerByPhoneNumber(String phoneNumber) {
        return Optional.of(customerRepository.findByPhoneNumber(phoneNumber));
    }


    @Override
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> updateCustomer(Long id, Customer updatedCustomer) {
        Customer customer = customerRepository.findById(id).orElseThrow();
        if(updatedCustomer.getFirstName() != null) {
            customer.setFirstName(updatedCustomer.getFirstName());
        }
        if(updatedCustomer.getLastName() != null) {
            customer.setLastName(updatedCustomer.getLastName());
        }
        if(updatedCustomer.getPhoneNumber() != null) {
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        }
        return Optional.of(customerRepository.save(customer));
    }
}

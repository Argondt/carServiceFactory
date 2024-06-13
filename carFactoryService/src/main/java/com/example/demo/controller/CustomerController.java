package com.example.demo.controller;

import com.example.demo.model.Customer;
import com.example.demo.service.CustomerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/customers")
@Slf4j
public class CustomerController{

    private CustomerService customerService;

    @PostMapping("")
    public ResponseEntity<Customer> addNewCustomer(@RequestBody Customer customer) {
        return ResponseEntity.of(customerService.createCustomer(customer));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable(name = "id") Long id, @RequestBody Customer customer) {
        return ResponseEntity.of(customerService.updateCustomer(id, customer));
    }

    @GetMapping("")
    public Page<Customer> getCustomers(@RequestParam(required = false) Integer pageNumber,
                                       @RequestParam(required = false)Integer pageSize) {
        Pageable pageable = (pageNumber != null && pageSize != null) ? PageRequest.of(pageNumber, pageSize) : Pageable.unpaged();
        return customerService.getCustomers(pageable);
    }

    @GetMapping("/number/{phoneNumber}")
    public ResponseEntity<Customer> getCustomerByPhoneNumber(@PathVariable String phoneNumber) {
        return ResponseEntity.of(customerService.getCustomerByPhoneNumber(phoneNumber));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.of(customerService.getCustomerById(id));
    }
}

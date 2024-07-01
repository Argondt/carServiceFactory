package com.example.demo.controller;

import com.example.demo.model.ServiceBeuaty;
import com.example.demo.service.ServiceService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/services")
@Slf4j
@CrossOrigin
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping()
    public Page<ServiceBeuaty> getServices(@RequestParam(required = false, defaultValue = "0") Integer pageNumber,
                                           @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return serviceService.getServices(pageable);
    }

    @PostMapping()
    public ResponseEntity<ServiceBeuaty> addNewService(@RequestBody ServiceBeuaty serviceBeuaty) {
        return ResponseEntity.of(serviceService.addService(serviceBeuaty));
    }
    @DeleteMapping("/{id}")
    public void deleteServiceBeauty(@PathVariable Long id) {
        serviceService.deleteById(id);
    }

}

package com.example.demo.controller;

import com.example.demo.model.ContactMessage;
import com.example.demo.service.ContactMessageService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @GetMapping("/contact-messages")
    public Page<ContactMessage> getContactMessages(@RequestParam(required = false,defaultValue = "0") Integer pageNumber,
                                                   @RequestParam(required = false,defaultValue = "10") Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return contactMessageService.getContactMessages(pageable);
    }

    @PostMapping("/contact-messages")
    public ResponseEntity<ContactMessage> createContactMessage(@RequestBody ContactMessage contactMessage) {
        return ResponseEntity.of(contactMessageService.createContactMessage(contactMessage));
    }
}

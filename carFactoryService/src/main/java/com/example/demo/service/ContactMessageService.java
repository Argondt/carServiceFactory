package com.example.demo.service;

import com.example.demo.model.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ContactMessageService {

    Page<ContactMessage> getContactMessages(Pageable pageable);

    Optional<ContactMessage> createContactMessage(ContactMessage contactMessage);

}

package com.example.demo.service;

import com.example.demo.model.ContactMessage;
import com.example.demo.repository.ContactMessageRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public Page<ContactMessage> getContactMessages(Pageable pageable) {
        return contactMessageRepository.findAll(pageable);
    }

    @Override
    public Optional<ContactMessage> createContactMessage(ContactMessage contactMessage) {
        return Optional.of(contactMessageRepository.save(contactMessage));
    }

}

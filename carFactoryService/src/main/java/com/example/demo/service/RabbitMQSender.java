package com.example.demo.service;

import com.example.demo.model.dto.EmailMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class RabbitMQSender {

    private final AmqpTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.email.name}")
    private String emailExchange;

    @Value("${rabbitmq.binding.email.name}")
    private String emailRoutingKey;
    public void send(EmailMessageDto company) {
        rabbitTemplate.convertAndSend(emailExchange, emailRoutingKey, company);
        System.out.println("Send msg = " + company);
    }
}
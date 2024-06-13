package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.Customer;
import com.example.demo.model.Employee;
import com.example.demo.model.ServiceBeuaty;
import com.example.demo.model.dto.AppointmentAddDto;
import com.example.demo.model.dto.EmailMessageDto;
import com.example.demo.model.dto.EmailTemplateMessageDto;
import com.example.demo.model.dto.EmailType;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
public class EmailService {

    public static EmailMessageDto createEmail(Appointment appointmentDto, Optional<Employee> optionalEmployee, Optional<Customer> optionalCustomer, Optional<ServiceBeuaty> serviceBeuaty, EmailType emailType) {
        return switch (emailType) {
            case POTWIERDZENIE_REZERWACJI, PRZYPOMNIENIE_WIZYTY24H, PRZYPOMNIENIE_WIZYTY1H ->
                    createAppointmentConfirmationEmail(appointmentDto, optionalEmployee, optionalCustomer, serviceBeuaty, emailType);
            default -> throw new IllegalArgumentException("Unknown email type: " + emailType);
        };
    }

    private static EmailMessageDto createAppointmentConfirmationEmail(Appointment appointmentdto, Optional<Employee> optionalEmployee, Optional<Customer> optionalCustomer, Optional<ServiceBeuaty> serviceBeuaty, EmailType emailType) {
        return getEmailMessageDto(appointmentdto, optionalEmployee, optionalCustomer, serviceBeuaty, emailType);
    }


    private static EmailMessageDto getEmailMessageDto(Appointment appointmentdto, Optional<Employee> optionalEmployee, Optional<Customer> optionalCustomer, Optional<ServiceBeuaty> serviceBeuaty, EmailType emailType) {
        EmailTemplateMessageDto build1 = EmailTemplateMessageDto
                .builder()
                .email(optionalCustomer.get().getEmail())
                .serviceName(serviceBeuaty.get().getName())
                .employeeSurname(optionalEmployee.get().getLastName())
                .employeeName(optionalEmployee.get().getFirstName())
                .time(appointmentdto.getTime().toString()).build();
        return EmailMessageDto
                .builder()
                .message(createEmailMessage(build1))
                .email(optionalCustomer.get().getEmail())
                .type(emailType)
                .build();
    }

    private static String createEmailMessage(EmailTemplateMessageDto emailMessageDto) {
        return "<html>" +
                "<body>" +
                "<h2>Potwierdzenie rezerwacji wizyty w CarFactory</h2>" +
                "<p>Kiedy: " + emailMessageDto.time() + "</p>" +
                "<p>Usługa: " + emailMessageDto.serviceName() + "</p>" +
                "<p>Do kogo: " + emailMessageDto.employeeName() + " " + emailMessageDto.employeeSurname() + "</p>" +
                "<p>Dziękujemy i zapraszamy.</p>" +
                "</body>" +
                "</html>";
    }
}

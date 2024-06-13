package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRMapArrayDataSource;
import org.springframework.core.Constants;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JasperServiceImpl implements JasperService {
    private final AppointmentRepository appointmentRepository;

    private InputStream getReportTemplateStream(String path) {
        ClassLoader classLoader = Constants.class.getClassLoader();
        return classLoader.getResourceAsStream(path);
    }

    @Override
    public byte[] generateReport(Long id) throws JRException, IOException {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        Map<String, Object> inputData = new HashMap<>();
        inputData.put("customerName", appointment.getCustomer().getFirstName());
        inputData.put("customerPhoneNumber", appointment.getCustomer().getPhoneNumber());
        inputData.put("serviceName", appointment.getServiceBeuaty().getName());
        inputData.put("serviceDuration", appointment.getDuration().toString());
        inputData.put("serviceTime", appointment.getTime().toString());
        System.out.println(inputData);
        try (InputStream reportTemplate = getReportTemplateStream("jasper/report_zwinne.jrxml")) {

            JasperReport compileReport = JasperCompileManager
                    .compileReport(reportTemplate);
            JasperPrint jasperPrint = JasperFillManager.fillReport(compileReport, inputData, new JREmptyDataSource());
            return JasperExportManager.exportReportToPdf(jasperPrint);
        }
    }
}

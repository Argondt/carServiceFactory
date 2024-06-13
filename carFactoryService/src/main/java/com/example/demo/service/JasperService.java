package com.example.demo.service;

import net.sf.jasperreports.engine.JRException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
@Service
public interface JasperService {
    byte[] generateReport(Long id) throws JRException, IOException;

}

package com.example.demo.controller;

import com.example.demo.model.ServiceBeuaty;
import com.example.demo.service.ServiceService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dictionaries")
@RequiredArgsConstructor
public class DictionaryController {
    private final ServiceService serviceBeuaty;
    Map<String, Class<?>> dictionaryMap = new HashMap<String, Class<?>>();

    @PostConstruct
    public void init() {
        dictionaryMap.put("serviceBeuaty", serviceBeuaty.getClass());
    }


    @GetMapping("/classes")
    public Map<String, String> getDictionaryClasses() {
        Map<String, String> response = new HashMap<>();

        for (Map.Entry<String, Class<?>> entry : dictionaryMap.entrySet()) {
            response.put(entry.getKey(), entry.getValue().getSimpleName());
        }
        return response;
    }
}

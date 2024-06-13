package com.example.demo.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
@RequiredArgsConstructor
@Getter
public enum UserRoleName {
    USER("użytkownik"), ADMIN("Administaror"),CLIENT("Klient");
    private final String displayName;

    public static UserRoleName fromDisplayName(String displayName) {
        return Arrays.stream(UserRoleName.values())
                .filter(role -> role.getDisplayName().equals(displayName))
                .findFirst()
                .orElse(null);
    }
}

package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
public enum EmailType {
    DODANIE_UZYTKOWNIKA("Witamy w CarFactory!"),
    POTWIERDZENIE_REZERWACJI("Potwierdzenie rezerwacji!"),
    ANULOWANIE_REZERWACJI("Anulowanie rezerwacji"),
    PRZYPOMNIENIE_WIZYTY24H("Przypomnienie o wizycie w salonie kosmetycznym - 24 godziny"),
    PRZYPOMNIENIE_WIZYTY1H("Przypomnienie o wizycie w salonie kosmetycznym - 1 godzina");
    private String string;
}
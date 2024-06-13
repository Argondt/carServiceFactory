# CarFactoryService

## Opis projektu
CarService to aplikacja internetowa stworzona w celu zarządzania usługami serwisu samochodowego. Aplikacja umożliwia zarządzanie profilami klientów, pracowników oraz administratorów, a także umawianie wizyt i zarządzanie terminarzem.

## Technologie
- **Backend**: Java + Spring Framework
- **Frontend**: React + TypeScript
- **Baza danych**: PostgreSQL

## Funkcjonalności

### Profil klienta
- **Wyświetlanie danych użytkownika**: Klient może przeglądać swoje dane.
- **Edycja danych**: Możliwość zmiany hasła, imienia, nazwiska i emaila.
- **Historia odbytych wizyt**: Dostęp do historii odbytych wizyt w serwisie.
- **Sprawdzanie dostępnych terminów**: Klient może przeglądać wolne terminy na wizyty serwisowe.
- **Umówienie wizyty**: Klient może umówić się na wizytę serwisową.

### Profil pracownika
- **Wyświetlanie danych użytkownika**: Pracownik może przeglądać swoje dane.
- **Edycja danych osobowych**: Możliwość zmiany danych osobowych oraz oferowanych usług.
- **Historia wizyt klientów**: Dostęp do historii wizyt poszczególnych klientów.
- **Ustawianie godzin pracy**: Pracownik może ustawiać swoje godziny pracy oraz terminy nieobecności.
- **Notatki do wizyt**: Pracownik może dodawać notatki do wizyt, które są niewidoczne dla klientów.
- **Umawianie wizyt**: Pracownik musi najpierw znaleźć klienta w bazie lub dodać nowego, a potem umówić go na wizytę serwisową.

### Profil administratora
- **Funkcje pracownika**: Administrator ma dostęp do wszystkich funkcji dostępnych dla pracowników.
- **Zarządzanie usługami**: Możliwość dodawania i usuwania usług serwisowych.
- **Zarządzanie kontami**: Administrator może zarządzać kontami użytkowników.
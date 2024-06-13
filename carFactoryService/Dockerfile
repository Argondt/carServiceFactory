FROM maven:3.9.4-eclipse-temurin-20-alpine as builder

# Kopiujemy pliki źródłowe projektu
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app

# Ustawiamy katalog roboczy
WORKDIR /usr/src/app

# Budujemy aplikację z pominięciem testów
RUN mvn clean package -DskipTests
#
FROM openjdk:20

COPY --from=builder /usr/src/app/target/demo-0.0.1-SNAPSHOT.jar /usr/app/demo-0.0.1-SNAPSHOT.jar
WORKDIR /usr/app

ENTRYPOINT ["java","-jar","demo-0.0.1-SNAPSHOT.jar"]

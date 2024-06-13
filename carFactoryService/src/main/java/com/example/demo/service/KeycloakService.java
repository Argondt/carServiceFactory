package com.example.demo.service;

import com.example.demo.model.dto.EmailMessageDto;
import com.example.demo.model.dto.EmailType;
import com.example.demo.model.dto.UserDetailsDto;
import com.example.demo.model.dto.UserRegisterDto;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class KeycloakService {

    private final Keycloak keycloak;
    private final RabbitMQSender rabbitMQSender;
//    private final String targetRealm = "studia";

    public KeycloakService(
            @Value("${keycloak.server-url}")
            String serverUrl,
            @Value("${keycloak.realm}")
            String realm,
            @Value("${keycloak.username}")
            String username,
            @Value("${keycloak.password}")
            String password,
            @Value("${keycloak.client-id}")
            String clientId, RabbitMQSender rabbitMQSender) {
        this.rabbitMQSender = rabbitMQSender;
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .username(username)
                .password(password)
                .clientId(clientId)
                .build();

    }

    public List<UserDetailsDto> getUsers() {
        List<UserRepresentation> users = keycloak.realm("studia").users().list();

        List<UserDetailsDto> userDetailsList = new ArrayList<>();

        for (UserRepresentation user : users) {
            List<RoleRepresentation> userRoles = keycloak.realm("studia").users().get(user.getId()).roles().realmLevel().listEffective();
            UserDetailsDto userDetails = getStudentDetailsDto(user, userRoles);

            userDetailsList.add(userDetails);
        }
        return userDetailsList;
    }


    public UserDetailsDto getUserById(String userId) {
        UserRepresentation keycloakUser = keycloak.realm("studia").users().get(userId).toRepresentation();
        List<RoleRepresentation> userRoles = keycloak.realm("studia").users().get(userId).roles().realmLevel().listEffective();

        return getStudentDetailsDto(keycloakUser, userRoles);
    }

    public String addUser(UserRegisterDto userDTO) {
        log.info("Creating user {} {}", userDTO.firstName(), userDTO.lastName());
        UsersResource usersResource = keycloak.realm("studia").users();
        String passowrd = generatePassword();
        // 1. Create a new UserRepresentation and populate it with data from the UserDTO
        UserRepresentation user = buildUserRepresentationFromDTO(userDTO);
        setPhoneNumber(userDTO.phoneNumber(), user);

        // 2. Create/Update the user
        try (Response response = usersResource.create(user)) {
            if (response.getStatus() == Response.Status.CREATED.getStatusCode()) {
                String path = response.getLocation().getPath();
                String userId = path.substring(path.lastIndexOf("/") + 1);

                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setTemporary(false);
                credential.setType(OAuth2Constants.PASSWORD);
                credential.setValue(passowrd);

                usersResource.get(userId).resetPassword(credential);

                RealmResource realmResource = keycloak.realm("studia");
                List<RoleRepresentation> roleRepresentations;

                if (userDTO.roles() == null || userDTO.roles().isEmpty()) {
                    roleRepresentations = List.of(realmResource.roles().get("user").toRepresentation());
                } else {
                    roleRepresentations = realmResource.roles()
                            .list()
                            .stream()
                            .filter(role -> userDTO.roles()
                                    .stream()
                                    .anyMatch(roleName -> roleName.equalsIgnoreCase(role.getName())))
                            .toList();
                }

                realmResource.users()
                        .get(userId)
                        .roles()
                        .realmLevel()
                        .add(roleRepresentations);

                log.info("User created successfully with ID: {}", userId);

                EmailMessageDto emailMessageDto = EmailMessageDto
                        .builder()
                        .message(createHtmlMessage(passowrd))
                        .email(userDTO.email())
                        .type(EmailType.DODANIE_UZYTKOWNIKA)
                        .build();

                rabbitMQSender.send(emailMessageDto);
                return userId; // Return the ID of the created user
            } else if (response.getStatus() == Response.Status.CONFLICT.getStatusCode()) {
                log.error("User already exists. Please contact the administrator.");
                return "User already exists. Please contact the administrator.";
            } else {
                log.error("Failed to create user: {}", response.getStatusInfo().getReasonPhrase());
                return "Failed to create user: " + response.getStatusInfo().getReasonPhrase();
            }
        } catch (Exception e) {
            log.error("Error occurred while creating user: {}", e.getMessage());
            return "Error occurred while creating user. Please contact the administrator";
        }
    }


    protected UserRepresentation buildUserRepresentationFromDTO(UserRegisterDto userDTO) {
        log.info("Building UserRepresentationFromDTO {} {}", userDTO.firstName(), userDTO.lastName());
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDTO.username());
        user.setEmail(userDTO.email());
        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());
        user.setEmailVerified(true);
        user.setEnabled(true);

        if (userDTO.roles() != null && !userDTO.roles().isEmpty()) {
            user.setRealmRoles(userDTO.roles());
        }
        log.info("Build completed successfully");
        return user;
    }

    private static Map<String, List<String>> setPhoneNumber(String phoneNumber, UserRepresentation user) {
        Map<String, List<String>> attributes = user.getAttributes();

        // Initialize the attributes map if it's null
        if (attributes == null) {
            attributes = new HashMap<>();
            user.setAttributes(attributes); // Ensure the user object has the initialized map
        }

        List<String> phoneNumbers = new ArrayList<>();
        phoneNumbers.add(phoneNumber);
        attributes.put("phoneNumber", phoneNumbers);

        return attributes;
    }

    public void updateRole(String userId, String roleName) {
        UsersResource keycloakUser = keycloak.realm("studia").users();
        RoleRepresentation role = new RoleRepresentation();
        role.setName(roleName);
        keycloakUser.get(userId).roles().realmLevel().add(List.of(role));
    }

    public void updateUser(String userId, UserDetailsDto userDTO) {
        UsersResource usersResource = keycloak.realm("studia").users();
        UserResource userResource;

        try {
            userResource = usersResource.get(userId);
            if (userResource == null) {
                throw new NotFoundException("User not found with ID: " + userId);
            }

            UserRepresentation user = userResource.toRepresentation();
            user.setUsername(userDTO.getUsername());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            userResource.update(user);

            List<RoleRepresentation> currentRoles = userResource.roles().realmLevel().listAll();

            userResource.roles().realmLevel().remove(currentRoles);

            List<RoleRepresentation> newRoles = userDTO.getRoles().stream()
                    .map(roleName -> {
                        RoleRepresentation role = keycloak.realm("studia").roles().get(roleName).toRepresentation();
                        if (role == null) {
                            throw new NotFoundException("Role not found: " + roleName);
                        }
                        return role;
                    }).collect(Collectors.toList());

            userResource.roles().realmLevel().add(newRoles);

        } catch (NotFoundException e) {
            System.err.println(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteUser(String userId) {
        UsersResource usersResource = getInstance();
        usersResource.get(userId)
                .remove();
    }

    public UsersResource getInstance() {
        return keycloak.realm("studia").users();
    }

    public void createGroup(String groupName) {

        RealmResource realmResource = keycloak.realm("studia");
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setName(groupName);
        Response response = keycloak.realm("studia").groups().add(groupRepresentation);
        log.info("Status odpowiedzi przy tworzeniu grupy: " + response.getStatus());
        log.info("Informacje o statusie: " + response.getStatusInfo());

        if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
            String responseBody = response.readEntity(String.class);
            log.error("Błąd przy tworzeniu grupy: " + responseBody);
        }
        response.close();
    }

    @NotNull
    private static UserDetailsDto getStudentDetailsDto(UserRepresentation user, List<RoleRepresentation> userRoles) {
        UserDetailsDto userDetails = new UserDetailsDto();
        userDetails.setId(user.getId());
        userDetails.setUsername(user.getUsername());
        userDetails.setFirstName(user.getFirstName());
        userDetails.setLastName(user.getLastName());
        userDetails.setEmail(user.getEmail());
        userDetails.setRoles(convertRolesToNames(userRoles));

        String phoneNumber = getPhoneNumber(user);

        userDetails.setPhoneNumber(phoneNumber);

        return userDetails;
    }

    private static String getPhoneNumber(UserRepresentation user) {
        Map<String, List<String>> attributes = user.getAttributes();
        List<String> phoneNumbers = attributes.get("phoneNumber");
        return phoneNumbers != null && !phoneNumbers.isEmpty() ? phoneNumbers.get(0) : "";
    }


    @NotNull
    private static List<String> convertRolesToNames(List<RoleRepresentation> userRoles) {
        return Collections.singletonList(userRoles.stream().map(RoleRepresentation::getName).toList().toString());
    }

    private String createHtmlMessage(String password) {
        return """
                <!DOCTYPE html>
                <html lang="pl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Utworzenie Konta</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            background-color: #ffffff;
                            margin: 50px auto;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                        }
                        h1 {
                            color: #333333;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666666;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin: 20px 0;
                            border-radius: 5px;
                            background-color: #4CAF50;
                            color: #ffffff;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Witamy!</h1>
                        <p>Twoje konto zostało pomyślnie utworzone.</p>
                        <p>Twoje hasło: <strong>""" + password + """
                        </strong></p>
                        <p>Zalecamy zalogowanie się i zmianę hasła przy pierwszym logowaniu.</p>
                        <p>Jeśli masz jakiekolwiek pytania, skontaktuj się z naszym działem wsparcia.</p>
                    </div>
                </body>
                </html>
                """;
    }

    public static String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }
}
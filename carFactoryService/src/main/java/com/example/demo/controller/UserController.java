package com.example.demo.controller;

import com.example.demo.model.dto.UserDetailsDto;
import com.example.demo.model.dto.UserRegisterDto;
import com.example.demo.service.KeycloakService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final KeycloakService keycloakUserService;

    public UserController(KeycloakService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    @GetMapping("")
    public List<UserDetailsDto> getUsers() {
        return keycloakUserService.getUsers();
    }

    @GetMapping("/{userId}")
    public UserDetailsDto getUserById(@PathVariable String userId) {
        return keycloakUserService.getUserById(userId);
    }

    @PostMapping()
    public String addUsers(@RequestBody UserRegisterDto userDTO){
        return keycloakUserService.addUser(userDTO);
    }
    @PutMapping(path = "/{userId}/update")
    public String updateUser(@PathVariable("userId") String userId, @RequestBody UserDetailsDto userDTO){
        keycloakUserService.updateUser(userId, userDTO);
        return "User Details Updated Successfully.";
    }

    @DeleteMapping(path = "/{userId}/delete")
    public String deleteUser(@PathVariable("userId") String userId){
        keycloakUserService.deleteUser(userId);
        return "User Deleted Successfully.";
    }
    @PutMapping("/{userId}/roles/{roleName}")
    public ResponseEntity<?> updateRole(@PathVariable String userId, @PathVariable String roleName) {
        keycloakUserService.updateRole(userId, roleName);
        return ResponseEntity.ok("Rola zaktualizowana");
    }
}

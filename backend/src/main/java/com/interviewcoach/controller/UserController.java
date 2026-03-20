package com.interviewcoach.controller;

import com.interviewcoach.entity.User;
import com.interviewcoach.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginOrCreate(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String name = payload.get("name");
        
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        
        User newUser = new User(name, email);
        return ResponseEntity.ok(userRepository.save(newUser));
    }
}

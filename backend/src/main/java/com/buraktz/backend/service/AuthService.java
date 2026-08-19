package com.buraktz.backend.service;

import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;


@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(BCrypt.hashpw(rawPassword, BCrypt.gensalt()));
        return userRepository.save(user);
    }
}
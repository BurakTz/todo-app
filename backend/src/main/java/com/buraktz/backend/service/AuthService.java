package com.buraktz.backend.service;

import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
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

    public String login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!BCrypt.checkpw(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Şifre yanlış");
        }

        return jwtService.generateToken(user.getId());
    }
}
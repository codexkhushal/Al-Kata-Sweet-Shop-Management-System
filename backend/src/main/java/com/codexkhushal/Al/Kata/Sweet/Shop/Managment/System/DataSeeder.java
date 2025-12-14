package com.codexkhushal.Al.Kata.Sweet.Shop.Managment.System;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SweetRepository sweetRepository;
    private final UserRepository userRepository;

    public DataSeeder(SweetRepository sweetRepository, UserRepository userRepository) {
        this.sweetRepository = sweetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        
        if (sweetRepository.count() == 0) {
            List<Sweet> initialSweets = List.of(
                new Sweet("Gulab Jamun", "Syrup", 120.00, 50, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&fit=crop"),
                new Sweet("Rasgulla", "Syrup", 110.00, 40, "https://upload.wikimedia.org/wikipedia/commons/e/e5/Rasgulla_01.jpg"),
                new Sweet("Kaju Katli", "Dry", 800.00, 25, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Kaju_Katli_01.jpg/800px-Kaju_Katli_01.jpg"),
                new Sweet("Jalebi", "Fried", 90.00, 60, "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&fit=crop"),
                new Sweet("Motichoor Laddu", "Laddu", 200.00, 80, "https://images.unsplash.com/photo-1599785209707-33306742588e?w=600&fit=crop")
            );
            sweetRepository.saveAll(initialSweets);
            System.out.println("✅ Sweets Added!");
        }

       
        userRepository.deleteAll();
        
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            
        User admin = new User("admin", encoder.encode("admin123"), "ROLE_ADMIN");
        userRepository.save(admin);

        User user = new User("khushal", encoder.encode("user123"), "ROLE_USER");
        userRepository.save(user);
            
        System.out.println("✅ Users successfully reset and added: (admin/admin123) and (khushal/user123)");
        
    }
}
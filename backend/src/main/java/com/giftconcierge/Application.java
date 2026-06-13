package com.giftconcierge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {

    public static void main(String[] args) {
        try {
            java.io.File source = new java.io.File(System.getProperty("user.home"), "Downloads\\logo.jpeg");
            java.io.File dest = new java.io.File("d:\\corporategifting\\frontend\\public\\logo.jpg");
            if (source.exists()) {
                java.nio.file.Files.copy(source.toPath(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                System.out.println(">>> LOGO IMAGE AUTOMATICALLY COPIED TO FRONTEND PUBLIC FOLDER! <<<");
            } else {
                System.err.println(">>> Source logo image not found at: " + source.getAbsolutePath());
            }
        } catch (Exception e) {
            System.err.println(">>> Could not copy logo: " + e.getMessage());
        }
        SpringApplication.run(Application.class, args);
    }
}

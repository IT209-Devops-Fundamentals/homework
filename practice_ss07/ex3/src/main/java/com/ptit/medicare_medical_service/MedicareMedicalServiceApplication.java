package com.ptit.medicare_medical_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MedicareMedicalServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicareMedicalServiceApplication.class, args);
    }

}

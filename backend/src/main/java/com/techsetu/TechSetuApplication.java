package com.techsetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TechSetuApplication {
    public static void main(String[] args) {
        SpringApplication.run(TechSetuApplication.class, args);
    }
}

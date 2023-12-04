package edu.eci.arsw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import java.util.Collections;

@SpringBootApplication
@ComponentScan(basePackages = {"edu.eci.arsw"})
public class SketchsyncAPIApplication {
    public static void main(String[] args) {
        SpringApplication.run(SketchsyncAPIApplication.class, args);
    }
}

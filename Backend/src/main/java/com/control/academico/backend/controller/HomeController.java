package com.control.academico.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("estado", "Activo");
        response.put("mensaje", "Bienvenido a la API REST del Sistema de Control Académico");
        response.put("version", "1.0.0");
        response.put("ruta_api", "/api/estudiantes");
        return response;
    }
}

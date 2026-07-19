package com.control.academico.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.control.academico.backend.model.Curso;
import com.control.academico.backend.model.Estudiante;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class EstudianteRepository {

    private final ObjectMapper objectMapper;
    private final List<Estudiante> estudiantes = new CopyOnWriteArrayList<>();
    private final String filePath = "data/estudiantes.json";

    public EstudianteRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        File file = new File(filePath);
        if (file.exists()) {
            try {
                List<Estudiante> loaded = objectMapper.readValue(file, new TypeReference<List<Estudiante>>() {});
                this.estudiantes.addAll(loaded);
            } catch (IOException e) {
                System.err.println("Error reading students from file, initializing with mock data: " + e.getMessage());
                loadMockData();
                saveToFile();
            }
        } else {
            // Create data directory if it doesn't exist
            try {
                Files.createDirectories(Paths.get("data"));
            } catch (IOException e) {
                System.err.println("Could not create data directory: " + e.getMessage());
            }
            loadMockData();
            saveToFile();
        }
    }

    private void loadMockData() {
        estudiantes.addAll(Arrays.asList(
            new Estudiante("1", "U202310452", "María Elena", "Flores Ruiz", "mfloresr@institucion.edu.pe", "Ingeniería de Sistemas", "V", 
                new ArrayList<>(Arrays.asList(
                    new Curso("c1", "Algoritmos y Estructura de Datos", 16),
                    new Curso("c2", "Base de Datos I", 15),
                    new Curso("c3", "Cálculo Multivariable", 11)
                ))
            ),
            new Estudiante("2", "U202215893", "Carlos Alberto", "Gómez Peralta", "cgomezp@institucion.edu.pe", "Administración de Empresas", "VII", 
                new ArrayList<>(Arrays.asList(
                    new Curso("c4", "Contabilidad Financiera", 12),
                    new Curso("c5", "Marketing Estratégico", 9),
                    new Curso("c6", "Administración de Operaciones", 13)
                ))
            ),
            new Estudiante("3", "U202410114", "Ana Sofía", "Mendoza Castillo", "amendozac@institucion.edu.pe", "Ingeniería Industrial", "III", 
                new ArrayList<>(Arrays.asList(
                    new Curso("c7", "Física I", 18),
                    new Curso("c8", "Álgebra Lineal", 14)
                ))
            ),
            new Estudiante("4", "U202322301", "Jorge Luis", "Quispe Huamán", "jquispeh@institucion.edu.pe", "Ingeniería de Sistemas", "IV", 
                new ArrayList<>(Arrays.asList(
                    new Curso("c9", "Programación Orientada a Objetos", 10),
                    new Curso("c10", "Matemática Discreta", 8)
                ))
            ),
            new Estudiante("5", "U202119954", "Valeria Lucía", "Vargas Delgado", "vvargasd@institucion.edu.pe", "Psicología", "IX", new ArrayList<>())
        ));
    }

    private synchronized void saveToFile() {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), estudiantes);
        } catch (IOException e) {
            System.err.println("Could not save students to file: " + e.getMessage());
        }
    }

    public List<Estudiante> findAll() {
        return new ArrayList<>(estudiantes);
    }

    public Optional<Estudiante> findById(String id) {
        return estudiantes.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    public Optional<Estudiante> findByCodigo(String codigo) {
        return estudiantes.stream().filter(e -> e.getCodigo().equalsIgnoreCase(codigo.trim())).findFirst();
    }

    public Optional<Estudiante> findByCorreo(String correo) {
        return estudiantes.stream().filter(e -> e.getCorreo().equalsIgnoreCase(correo.trim())).findFirst();
    }

    public synchronized Estudiante save(Estudiante estudiante) {
        // If it's a new student (no ID or not in the list)
        if (estudiante.getId() == null || estudiante.getId().isEmpty()) {
            String nextId = getNextId();
            estudiante.setId(nextId);
            estudiantes.add(estudiante);
        } else {
            // Find and update
            int index = -1;
            for (int i = 0; i < estudiantes.size(); i++) {
                if (estudiantes.get(i).getId().equals(estudiante.getId())) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                estudiantes.set(index, estudiante);
            } else {
                estudiantes.add(estudiante);
            }
        }
        saveToFile();
        return estudiante;
    }

    public synchronized boolean deleteById(String id) {
        boolean removed = estudiantes.removeIf(e -> e.getId().equals(id));
        if (removed) {
            saveToFile();
        }
        return removed;
    }

    private String getNextId() {
        long maxId = estudiantes.stream()
                .mapToLong(e -> {
                    try {
                        return Long.parseLong(e.getId());
                    } catch (NumberFormatException ex) {
                        return 0L;
                    }
                })
                .max()
                .orElse(0L);
        return String.valueOf(maxId + 1);
    }
}

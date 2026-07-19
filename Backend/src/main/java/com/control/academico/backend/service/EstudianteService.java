package com.control.academico.backend.service;

import com.control.academico.backend.exception.ConflictException;
import com.control.academico.backend.exception.ResourceNotFoundException;
import com.control.academico.backend.model.Estudiante;
import com.control.academico.backend.repository.EstudianteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;

    public EstudianteService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    public List<Estudiante> getAllEstudiantes() {
        return estudianteRepository.findAll();
    }

    public Estudiante getEstudianteById(String id) {
        return estudianteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El estudiante solicitado no existe."));
    }

    public Estudiante createEstudiante(Estudiante estudiante) {
        // Validate code duplicate
        if (estudiante.getCodigo() != null && !estudiante.getCodigo().isEmpty()) {
            Optional<Estudiante> existingByCodigo = estudianteRepository.findByCodigo(estudiante.getCodigo());
            if (existingByCodigo.isPresent()) {
                throw new ConflictException("Ya existe un registro con ese código o correo.");
            }
        }

        // Validate email duplicate
        if (estudiante.getCorreo() != null && !estudiante.getCorreo().isEmpty()) {
            Optional<Estudiante> existingByCorreo = estudianteRepository.findByCorreo(estudiante.getCorreo());
            if (existingByCorreo.isPresent()) {
                throw new ConflictException("Ya existe un registro con ese código o correo.");
            }
        }

        // Clean up inputs (trim)
        if (estudiante.getCodigo() != null) estudiante.setCodigo(estudiante.getCodigo().trim().toUpperCase());
        if (estudiante.getNombres() != null) estudiante.setNombres(estudiante.getNombres().trim());
        if (estudiante.getApellidos() != null) estudiante.setApellidos(estudiante.getApellidos().trim());
        if (estudiante.getCorreo() != null) estudiante.setCorreo(estudiante.getCorreo().trim().toLowerCase());

        return estudianteRepository.save(estudiante);
    }

    public Estudiante updateEstudiante(String id, Estudiante cambios) {
        Estudiante existente = getEstudianteById(id);

        // Validate code duplicate (excluding self)
        if (cambios.getCodigo() != null && !cambios.getCodigo().isEmpty()) {
            String codigoNuevo = cambios.getCodigo().trim();
            if (!existente.getCodigo().equalsIgnoreCase(codigoNuevo)) {
                Optional<Estudiante> duplicate = estudianteRepository.findByCodigo(codigoNuevo);
                if (duplicate.isPresent()) {
                    throw new ConflictException("Ya existe un registro con ese código o correo.");
                }
                existente.setCodigo(codigoNuevo.toUpperCase());
            }
        }

        // Validate email duplicate (excluding self)
        if (cambios.getCorreo() != null && !cambios.getCorreo().isEmpty()) {
            String correoNuevo = cambios.getCorreo().trim();
            if (!existente.getCorreo().equalsIgnoreCase(correoNuevo)) {
                Optional<Estudiante> duplicate = estudianteRepository.findByCorreo(correoNuevo);
                if (duplicate.isPresent()) {
                    throw new ConflictException("Ya existe un registro con ese código o correo.");
                }
                existente.setCorreo(correoNuevo.toLowerCase());
            }
        }

        // Update other fields if they are provided
        if (cambios.getNombres() != null) existente.setNombres(cambios.getNombres().trim());
        if (cambios.getApellidos() != null) existente.setApellidos(cambios.getApellidos().trim());
        if (cambios.getCarrera() != null) existente.setCarrera(cambios.getCarrera().trim());
        if (cambios.getCiclo() != null) existente.setCiclo(cambios.getCiclo().trim());
        if (cambios.getCursos() != null) existente.setCursos(cambios.getCursos());

        return estudianteRepository.save(existente);
    }

    public void deleteEstudiante(String id) {
        boolean deleted = estudianteRepository.deleteById(id);
        if (!deleted) {
            throw new ResourceNotFoundException("El estudiante solicitado no existe.");
        }
    }
}

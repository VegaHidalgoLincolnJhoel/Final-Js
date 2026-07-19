package com.control.academico.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Estudiante {
    private String id;
    private String codigo;
    private String nombres;
    private String apellidos;
    private String correo;
    private String carrera;
    private String ciclo;
    private List<Curso> cursos = new ArrayList<>();

    public Estudiante() {
    }

    public Estudiante(String id, String codigo, String nombres, String apellidos, String correo, String carrera, String ciclo, List<Curso> cursos) {
        this.id = id;
        this.codigo = codigo;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.carrera = carrera;
        this.ciclo = ciclo;
        this.cursos = cursos != null ? cursos : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getCarrera() {
        return carrera;
    }

    public void setCarrera(String carrera) {
        this.carrera = carrera;
    }

    public String getCiclo() {
        return ciclo;
    }

    public void setCiclo(String ciclo) {
        this.ciclo = ciclo;
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos != null ? cursos : new ArrayList<>();
    }
}

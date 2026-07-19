import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Estudiante } from '../models/student.model';

/**
 * Simula un backend REST real (con angular-in-memory-web-api).
 * Todas las peticiones HTTP pasan realmente por el pipeline de Angular
 * (HttpClient -> interceptors -> "servidor"), lo que permite trabajar
 * con Observables, códigos de estado y manejo de errores como si
 * existiera una API REST verdadera. Cuando el backend real (Spring Boot
 * / Node) esté listo, solo se cambia la URL base en environment.ts.
 */
@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const estudiantes: Estudiante[] = [
      {
        id: '1',
        codigo: 'U202310452',
        nombres: 'María Elena',
        apellidos: 'Flores Ruiz',
        correo: 'mfloresr@institucion.edu.pe',
        carrera: 'Ingeniería de Sistemas',
        ciclo: 'V',
        cursos: [
          { id: 'c1', nombre: 'Algoritmos y Estructura de Datos', calificacion: 16 },
          { id: 'c2', nombre: 'Base de Datos I', calificacion: 15 },
          { id: 'c3', nombre: 'Cálculo Multivariable', calificacion: 11 }
        ]
      },
      {
        id: '2',
        codigo: 'U202215893',
        nombres: 'Carlos Alberto',
        apellidos: 'Gómez Peralta',
        correo: 'cgomezp@institucion.edu.pe',
        carrera: 'Administración de Empresas',
        ciclo: 'VII',
        cursos: [
          { id: 'c4', nombre: 'Contabilidad Financiera', calificacion: 12 },
          { id: 'c5', nombre: 'Marketing Estratégico', calificacion: 9 },
          { id: 'c6', nombre: 'Administración de Operaciones', calificacion: 13 }
        ]
      },
      {
        id: '3',
        codigo: 'U202410114',
        nombres: 'Ana Sofía',
        apellidos: 'Mendoza Castillo',
        correo: 'amendozac@institucion.edu.pe',
        carrera: 'Ingeniería Industrial',
        ciclo: 'III',
        cursos: [
          { id: 'c7', nombre: 'Física I', calificacion: 18 },
          { id: 'c8', nombre: 'Álgebra Lineal', calificacion: 14 }
        ]
      },
      {
        id: '4',
        codigo: 'U202322301',
        nombres: 'Jorge Luis',
        apellidos: 'Quispe Huamán',
        correo: 'jquispeh@institucion.edu.pe',
        carrera: 'Ingeniería de Sistemas',
        ciclo: 'IV',
        cursos: [
          { id: 'c9', nombre: 'Programación Orientada a Objetos', calificacion: 10 },
          { id: 'c10', nombre: 'Matemática Discreta', calificacion: 8 }
        ]
      },
      {
        id: '5',
        codigo: 'U202119954',
        nombres: 'Valeria Lucía',
        apellidos: 'Vargas Delgado',
        correo: 'vvargasd@institucion.edu.pe',
        carrera: 'Psicología',
        ciclo: 'IX',
        cursos: []
      }
    ];
    return { estudiantes };
  }

  // Genera IDs de forma consistente con el resto de la app
  genId(collection: Estudiante[]): string {
    return collection.length > 0
      ? (Math.max(...collection.map(e => +e.id)) + 1).toString()
      : '1';
  }
}

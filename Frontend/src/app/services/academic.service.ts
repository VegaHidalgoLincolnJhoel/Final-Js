import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Estudiante, Curso } from '../models/student.model';

const API_URL = 'http://localhost:8080/api/estudiantes';

/**
 * Servicio central de datos académicos.
 * Consume la API REST (simulada con angular-in-memory-web-api) a través
 * de HttpClient. Todos los métodos devuelven Observables y propagan
 * errores con manejo centralizado en handleError().
 */
@Injectable({ providedIn: 'root' })
export class AcademicService {

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getEstudiante(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  crearEstudiante(estudiante: Omit<Estudiante, 'id'>): Observable<Estudiante> {
    return this.http.post<Estudiante>(API_URL, estudiante).pipe(
      catchError(this.handleError)
    );
  }

  actualizarEstudiante(id: string, cambios: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${API_URL}/${id}`, { id, ...cambios }).pipe(
      catchError(this.handleError)
    );
  }

  eliminarEstudiante(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Reglas de negocio (compartidas por componentes) ---

  calcularPromedio(estudiante: Estudiante): number | null {
    try {
      if (!estudiante.cursos || estudiante.cursos.length === 0) return null;
      const suma = estudiante.cursos.reduce((acc, c) => acc + c.calificacion, 0);
      return Number((suma / estudiante.cursos.length).toFixed(1));
    } catch (error) {
      console.error('Error al calcular el promedio del estudiante:', error);
      return null;
    }
  }

  obtenerCondicion(promedio: number | null): 'Aprobado' | 'Desaprobado' | 'Sin calificación' {
    if (promedio === null) return 'Sin calificación';
    return promedio >= 11 ? 'Aprobado' : 'Desaprobado';
  }

  // --- Manejo centralizado de errores HTTP ---

  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error inesperado. Intente nuevamente.';

    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor. Verifique su conexión.';
    } else if (error.status === 404) {
      mensaje = 'El estudiante solicitado no existe.';
    } else if (error.status === 409) {
      mensaje = 'Ya existe un registro con ese código o correo.';
    } else if (error.status >= 500) {
      mensaje = 'Error interno del servidor. Intente más tarde.';
    }

    console.error(`Error HTTP ${error.status}:`, error.message);
    return throwError(() => new Error(mensaje));
  }
}

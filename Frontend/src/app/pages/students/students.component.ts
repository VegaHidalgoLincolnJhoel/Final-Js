import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estudiante } from '../../models/student.model';
import { AcademicService } from '../../services/academic.service';
import { StudentListComponent } from '../../components/student-list/student-list.component';
import { StudentFormComponent } from '../../components/student-form/student-form.component';
import { CourseGradesFormComponent } from '../../components/course-grades-form/course-grades-form.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

type ModoFormulario = 'idle' | 'agregar' | 'editar';

/**
 * Página Estudiantes: orquesta el listado y los formularios,
 * consumiendo la API REST vía AcademicService (HttpClient) con
 * manejo de errores y estados de carga.
 * Integrante 2 - Arquitectura (orquestación) / Integrante 3 (componentes).
 */
@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, StudentListComponent, StudentFormComponent, CourseGradesFormComponent, ConfirmModalComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  codigosExistentes: string[] = [];
  correosExistentes: string[] = [];
  cargando = true;
  error = '';

  modoFormulario: ModoFormulario = 'idle';
  estudianteSeleccionado: Estudiante | null = null;
  estudianteParaNotas: Estudiante | null = null;
  estudianteAEliminar: Estudiante | null = null;

  mensajeExito = '';
  private timeoutAlerta: any;

  // Se recalculan solo cuando 'estudiantes' cambia (no en cada ciclo de
  // detección de cambios), para no romper el formulario del hijo.
  codigosExistentes: string[] = [];
  correosExistentes: string[] = [];

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  private actualizarListasDeValidacion(): void {
=======
  actualizarListasExistentes(): void {
>>>>>>> Stashed changes
=======
  actualizarListasExistentes(): void {
>>>>>>> Stashed changes
    this.codigosExistentes = this.estudiantes.map(e => e.codigo);
    this.correosExistentes = this.estudiantes.map(e => e.correo);
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.error = '';
    this.academicService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        this.actualizarListasDeValidacion();
=======
        this.actualizarListasExistentes();
>>>>>>> Stashed changes
=======
        this.actualizarListasExistentes();
>>>>>>> Stashed changes
        this.cargando = false;
      },
      error: (err) => { this.error = err.message; this.cargando = false; }
    });
  }

  mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    clearTimeout(this.timeoutAlerta);
    this.timeoutAlerta = setTimeout(() => (this.mensajeExito = ''), 4000);
  }

  // --- Acciones de la lista ---

  onAgregarNuevo(): void {
    this.modoFormulario = 'agregar';
    this.estudianteSeleccionado = null;
    this.estudianteParaNotas = null;
  }

  onEditar(est: Estudiante): void {
    this.modoFormulario = 'editar';
    this.estudianteSeleccionado = est;
    this.estudianteParaNotas = null;
  }

  onGestionarNotas(est: Estudiante): void {
    this.estudianteParaNotas = est;
    this.modoFormulario = 'idle';
    this.estudianteSeleccionado = null;
  }

  onEliminar(est: Estudiante): void {
    this.estudianteAEliminar = est;
  }

  confirmarEliminar(): void {
    if (!this.estudianteAEliminar) return;
    const id = this.estudianteAEliminar.id;

    this.academicService.eliminarEstudiante(id).subscribe({
      next: () => {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        this.actualizarListasDeValidacion();
=======
        this.actualizarListasExistentes();
>>>>>>> Stashed changes
=======
        this.actualizarListasExistentes();
>>>>>>> Stashed changes
        if (this.estudianteSeleccionado?.id === id) { this.estudianteSeleccionado = null; this.modoFormulario = 'idle'; }
        if (this.estudianteParaNotas?.id === id) { this.estudianteParaNotas = null; }
        this.mostrarExito('Estudiante eliminado correctamente.');
        this.estudianteAEliminar = null;
      },
      error: (err) => {
        this.error = err.message;
        this.estudianteAEliminar = null;
      }
    });
  }

  // --- Formulario de estudiante ---

  onGuardarEstudiante(datos: Omit<Estudiante, 'id' | 'cursos'>): void {
    if (this.modoFormulario === 'editar' && this.estudianteSeleccionado) {
      this.academicService.actualizarEstudiante(this.estudianteSeleccionado.id, datos).subscribe({
        next: (actualizado) => {
          this.estudiantes = this.estudiantes.map(e => e.id === actualizado.id ? actualizado : e);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          this.actualizarListasDeValidacion();
=======
          this.actualizarListasExistentes();
>>>>>>> Stashed changes
=======
          this.actualizarListasExistentes();
>>>>>>> Stashed changes
          this.modoFormulario = 'idle';
          this.estudianteSeleccionado = null;
          this.mostrarExito(`Datos de ${actualizado.nombres} actualizados con éxito.`);
        },
        error: (err) => (this.error = err.message)
      });
    } else {
      this.academicService.crearEstudiante({ ...datos, cursos: [] }).subscribe({
        next: (nuevo) => {
          this.estudiantes = [...this.estudiantes, nuevo];
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          this.actualizarListasDeValidacion();
=======
          this.actualizarListasExistentes();
>>>>>>> Stashed changes
=======
          this.actualizarListasExistentes();
>>>>>>> Stashed changes
          this.modoFormulario = 'idle';
          this.mostrarExito(`Estudiante ${nuevo.nombres} ${nuevo.apellidos} registrado con éxito.`);
        },
        error: (err) => (this.error = err.message)
      });
    }
  }

  onCancelarFormulario(): void {
    this.modoFormulario = 'idle';
    this.estudianteSeleccionado = null;
  }

  // --- Formulario de cursos/notas ---

  onActualizarCursos(actualizado: Estudiante): void {
    this.academicService.actualizarEstudiante(actualizado.id, { cursos: actualizado.cursos }).subscribe({
      next: (est) => {
        this.estudiantes = this.estudiantes.map(e => e.id === est.id ? est : e);
        this.actualizarListasExistentes();
        this.estudianteParaNotas = est;
        this.mostrarExito('Calificaciones actualizadas con éxito.');
      },
      error: (err) => (this.error = err.message)
    });
  }

  onCerrarNotas(): void {
    this.estudianteParaNotas = null;
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Estudiante, CARRERAS, CICLOS } from '../../models/student.model';
import { CondicionPipe } from '../../pipes/condicion.pipe';
import { PromedioPipe } from '../../pipes/promedio.pipe';

/**
 * Listado de estudiantes con buscador y filtros dinámicos (carrera/ciclo).
 * Integrante 3 - Componentes, formularios y diseño de interfaz.
 */
@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CondicionPipe, PromedioPipe],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  @Input() estudiantes: Estudiante[] = [];
  @Output() editar = new EventEmitter<Estudiante>();
  @Output() eliminar = new EventEmitter<Estudiante>();
  @Output() gestionarNotas = new EventEmitter<Estudiante>();
  @Output() agregarNuevo = new EventEmitter<void>();

  carreras = CARRERAS;
  ciclos = CICLOS;

  termino = '';
  carreraSeleccionada = '';
  cicloSeleccionado = '';

  get estudiantesFiltrados(): Estudiante[] {
    const termino = this.termino.trim().toLowerCase();
    return this.estudiantes.filter(e => {
      const coincideBusqueda =
        termino === '' ||
        e.codigo.toLowerCase().includes(termino) ||
        e.apellidos.toLowerCase().includes(termino);
      const coincideCarrera = this.carreraSeleccionada === '' || e.carrera === this.carreraSeleccionada;
      const coincideCiclo = this.cicloSeleccionado === '' || e.ciclo === this.cicloSeleccionado;
      return coincideBusqueda && coincideCarrera && coincideCiclo;
    });
  }

  get hayFiltrosActivos(): boolean {
    return !!(this.termino || this.carreraSeleccionada || this.cicloSeleccionado);
  }

  limpiarFiltros(): void {
    this.termino = '';
    this.carreraSeleccionada = '';
    this.cicloSeleccionado = '';
  }
}

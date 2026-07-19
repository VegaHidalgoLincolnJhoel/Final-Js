import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Estudiante } from '../../models/student.model';
import { AcademicService } from '../../services/academic.service';
import { CondicionPipe } from '../../pipes/condicion.pipe';
import { PromedioPipe } from '../../pipes/promedio.pipe';

/**
 * Página de detalle de un estudiante (tercera ruta de la aplicación).
 * Usa un parámetro de ruta (:id) y demuestra el uso del método find()
 * junto con el consumo de la API REST vía AcademicService.
 * Integrante 2 - Arquitectura y Navegación (ruta) / Integrante 3 (vista).
 */
@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CondicionPipe, PromedioPipe],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private academicService = inject(AcademicService);

  estudiante: Estudiante | null = null;
  cargando = true;
  error = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    try {
      if (!idParam) {
        throw new Error('No se especificó un identificador de estudiante.');
      }
      this.cargarEstudiante(idParam);
    } catch (err: any) {
      this.error = err.message || 'Ocurrió un error al leer el parámetro de la ruta.';
      this.cargando = false;
    }
  }

  private cargarEstudiante(id: string): void {
    this.academicService.getEstudiante(id).subscribe({
      next: (est) => { this.estudiante = est; this.cargando = false; },
      error: (err) => { this.error = err.message; this.cargando = false; }
    });
  }

  cursoConMayorNota() {
    // Ejemplo de uso de find() sobre los cursos del estudiante
    if (!this.estudiante || this.estudiante.cursos.length === 0) return null;
    const maxNota = Math.max(...this.estudiante.cursos.map(c => c.calificacion));
    return this.estudiante.cursos.find(c => c.calificacion === maxNota) ?? null;
  }
}

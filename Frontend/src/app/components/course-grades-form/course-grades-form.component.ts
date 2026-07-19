import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estudiante, Curso } from '../../models/student.model';
import { AcademicService } from '../../services/academic.service';
import { CondicionPipe } from '../../pipes/condicion.pipe';
import { PromedioPipe } from '../../pipes/promedio.pipe';

/**
 * Formulario de cursos y calificaciones de un estudiante.
 * Integrante 3 - Componentes, formularios y diseño de interfaz.
 */
@Component({
  selector: 'app-course-grades-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CondicionPipe, PromedioPipe],
  templateUrl: './course-grades-form.component.html',
  styleUrl: './course-grades-form.component.css'
})
export class CourseGradesFormComponent {
  @Input({ required: true }) estudiante!: Estudiante;
  @Output() actualizar = new EventEmitter<Estudiante>();
  @Output() cerrar = new EventEmitter<void>();

  error = '';

  private fb = inject(FormBuilder);
  public academicService = inject(AcademicService);

  form = this.fb.group({
    nombreCurso: ['', Validators.required],
    calificacion: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(20)])
  });

  agregarCurso(): void {
    this.error = '';

    if (this.form.invalid) {
      this.error = 'Complete el nombre del curso y una calificación válida (0-20).';
      this.form.markAllAsTouched();
      return;
    }

    const nuevoCurso: Curso = {
      id: Math.random().toString(36).substring(2, 9),
      nombre: (this.form.value.nombreCurso || '').trim(),
      calificacion: Number(this.form.value.calificacion)
    };

    const actualizado: Estudiante = {
      ...this.estudiante,
      cursos: [...this.estudiante.cursos, nuevoCurso]
    };

    this.actualizar.emit(actualizado);
    this.form.reset({ nombreCurso: '', calificacion: null });
  }

  eliminarCurso(cursoId: string): void {
    const actualizado: Estudiante = {
      ...this.estudiante,
      cursos: this.estudiante.cursos.filter(c => c.id !== cursoId)
    };
    this.actualizar.emit(actualizado);
  }
}

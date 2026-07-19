import { Pipe, PipeTransform } from '@angular/core';
import { Estudiante } from '../models/student.model';

/**
 * Pipe: calcula el promedio de ciclo de un estudiante a partir de sus cursos.
 * Uso en template: {{ estudiante | promedio }}
 */
@Pipe({
  name: 'promedio',
  standalone: true
})
export class PromedioPipe implements PipeTransform {
  transform(estudiante: Estudiante): number | null {
    if (!estudiante?.cursos || estudiante.cursos.length === 0) return null;
    const suma = estudiante.cursos.reduce((acc, c) => acc + c.calificacion, 0);
    return Number((suma / estudiante.cursos.length).toFixed(1));
  }
}

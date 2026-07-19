import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe: transforma un promedio numérico (o null) en el texto de condición
 * académica. Uso en template: {{ promedio | condicion }}
 */
@Pipe({
  name: 'condicion',
  standalone: true
})
export class CondicionPipe implements PipeTransform {
  transform(promedio: number | null): 'Aprobado' | 'Desaprobado' | 'Sin calificación' {
    if (promedio === null || promedio === undefined) return 'Sin calificación';
    return promedio >= 11 ? 'Aprobado' : 'Desaprobado';
  }
}

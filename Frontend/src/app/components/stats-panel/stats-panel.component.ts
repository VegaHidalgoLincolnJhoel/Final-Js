import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estudiante } from '../../models/student.model';
import { AcademicService } from '../../services/academic.service';

/**
 * Panel de estadísticas del dashboard (tarjetas).
 * Integrante 3 - Componentes y Diseño de Interfaz.
 */
@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.component.html',
  styleUrl: './stats-panel.component.css'
})
export class StatsPanelComponent implements OnChanges {
  @Input() estudiantes: Estudiante[] = [];

  totalEstudiantes = 0;
  promedioGeneral = 0;
  aprobados = 0;
  desaprobados = 0;
  sinCalificar = 0;
  conNotas = 0;

  constructor(private academicService: AcademicService) {}

  ngOnChanges(): void {
    this.totalEstudiantes = this.estudiantes.length;

    let sumaTotal = 0;
    this.aprobados = 0;
    this.desaprobados = 0;
    this.sinCalificar = 0;
    this.conNotas = 0;

    for (const est of this.estudiantes) {
      const promedio = this.academicService.calcularPromedio(est);
      if (promedio !== null) {
        sumaTotal += promedio;
        this.conNotas++;
        const condicion = this.academicService.obtenerCondicion(promedio);
        condicion === 'Aprobado' ? this.aprobados++ : this.desaprobados++;
      } else {
        this.sinCalificar++;
      }
    }

    this.promedioGeneral = this.conNotas > 0 ? Number((sumaTotal / this.conNotas).toFixed(1)) : 0;
  }
}

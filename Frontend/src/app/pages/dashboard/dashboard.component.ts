import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Estudiante } from '../../models/student.model';
import { AcademicService } from '../../services/academic.service';
import { StatsPanelComponent } from '../../components/stats-panel/stats-panel.component';

/**
 * Página Dashboard: consume la API REST vía AcademicService (HttpClient)
 * y maneja los estados de carga y error.
 * Integrante 2 - Arquitectura (orquestación) / Integrante 3 (StatsPanel).
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  cargando = true;
  error = '';

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.error = '';
    this.academicService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.message || 'No se pudieron cargar los estudiantes.';
        this.cargando = false;
      }
    });
  }
}

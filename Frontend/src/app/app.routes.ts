import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentsComponent } from './pages/students/students.component';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';

/**
 * Rutas de la aplicación (Integrante 2 - Arquitectura y Navegación).
 */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard - Control Académico' },
  { path: 'estudiantes', component: StudentsComponent, title: 'Estudiantes - Control Académico' },
  { path: 'estudiantes/:id', component: StudentDetailComponent, title: 'Detalle del Estudiante' },
  { path: '**', redirectTo: 'dashboard' }
];

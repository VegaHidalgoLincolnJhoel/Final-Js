import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Barra de navegación superior. Usa routerLink/routerLinkActive
 * para el enrutamiento entre Dashboard y Estudiantes.
 * Integrante 2 - Arquitectura y Navegación.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {}

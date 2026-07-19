export interface Curso {
  id: string;
  nombre: string;
  calificacion: number; // Escala 0-20
}

export interface Estudiante {
  id: string;
  codigo: string;      // Código académico, ej. U202310452
  nombres: string;
  apellidos: string;
  correo: string;       // Correo institucional
  carrera: string;
  ciclo: string;
  cursos: Curso[];
}

export const CARRERAS: string[] = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Administración de Empresas',
  'Psicología',
  'Contabilidad'
];

export const CICLOS: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

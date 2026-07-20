import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Estudiante, CARRERAS, CICLOS } from '../../models/student.model';

/**
 * Formulario de alta/edición de estudiante con validaciones reactivas.
 * Integrante 3 - Componentes, formularios y diseño de interfaz.
 */
@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnChanges {
  @Input() estudianteAEditar: Estudiante | null = null;
  @Input() codigosExistentes: string[] = [];
  @Input() correosExistentes: string[] = [];

  @Output() guardar = new EventEmitter<Omit<Estudiante, 'id' | 'cursos'>>();
  @Output() cancelar = new EventEmitter<void>();

  carreras = CARRERAS;
  ciclos = CICLOS;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(/^U\d{8,9}$/i)]],
    ciclo: ['', Validators.required],
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    carrera: ['', Validators.required],
    correo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9._%+-]+@institucion\.edu\.pe$/i)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['codigosExistentes'] || changes['correosExistentes'] || changes['estudianteAEditar']) {
      this.form.controls.codigo.setValidators([
        Validators.required,
        Validators.pattern(/^U\d{8,9}$/i),
        this.duplicadoValidator(this.codigosExistentes, this.estudianteAEditar?.codigo)
      ]);
      this.form.controls.correo.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Z0-9._%+-]+@institucion\.edu\.pe$/i),
        this.duplicadoValidator(this.correosExistentes, this.estudianteAEditar?.correo)
      ]);
      this.form.controls.codigo.updateValueAndValidity({ emitEvent: false });
      this.form.controls.correo.updateValueAndValidity({ emitEvent: false });
    }

    if (changes['estudianteAEditar']) {
      if (this.estudianteAEditar) {
        this.form.setValue({
          codigo: this.estudianteAEditar.codigo,
          ciclo: this.estudianteAEditar.ciclo,
          nombres: this.estudianteAEditar.nombres,
          apellidos: this.estudianteAEditar.apellidos,
          carrera: this.estudianteAEditar.carrera,
          correo: this.estudianteAEditar.correo
        });
      } else {
        this.form.reset({ codigo: '', ciclo: '', nombres: '', apellidos: '', carrera: '', correo: '' });
      }
    }
  }

  private duplicadoValidator(lista: string[], valorActual?: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = (control.value || '').toString().trim().toLowerCase();
      if (!valor) return null;
      // Si estamos editando, el propio valor del estudiante no cuenta como duplicado
      if (valorActual && valor === valorActual.trim().toLowerCase()) return null;
      const existe = lista.some(v => v.trim().toLowerCase() === valor);
      return existe ? { duplicado: true } : null;
    };
  }

  generarCorreoSugerido(): void {
    const nombres = this.form.value.nombres || '';
    const apellidos = this.form.value.apellidos || '';
    if (!nombres || !apellidos) return;

    const quitarTildes = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const primeraLetra = quitarTildes(nombres.trim().charAt(0).toLowerCase());
    const primerApellido = quitarTildes(apellidos.trim().split(' ')[0].toLowerCase());
    this.form.patchValue({ correo: `${primeraLetra}${primerApellido}@institucion.edu.pe` });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.guardar.emit({
      codigo: (v.codigo || '').trim().toUpperCase(),
      nombres: (v.nombres || '').trim(),
      apellidos: (v.apellidos || '').trim(),
      correo: (v.correo || '').trim().toLowerCase(),
      carrera: v.carrera || '',
      ciclo: v.ciclo || ''
    });
  }
}

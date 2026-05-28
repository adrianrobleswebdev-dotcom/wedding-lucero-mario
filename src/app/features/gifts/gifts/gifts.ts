import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gifts',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gifts.html',
  styleUrl: './gifts.css',
})
export class Gifts {
  isModalOpen = false;
  isSubmitting = false;
  isSuccess = false; // Bandera para mostrar el mensaje de éxito
  private http = inject(HttpClient);
  isValidatingPhone = false;
  isAlreadyRegistered = false;

  private googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxzhMXKyTQUXLdaCbq25DsS3RLnY58S1mNMRLIKVOgg5L7DWKLFbfgbGr2ueW3WMzeb/exec';

  // 1. Actualiza tu FormGroup agregando el control 'asistencia'
  confirmForm = new FormGroup({
    nombreCompleto: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    ]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(10) // Añadido para que coincida con tu HTML
    ]),
    asistencia: new FormControl(null, [ // Inicializado en null, requerido para avanzar
      Validators.required
    ])
  });

  openModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
    this.confirmForm.reset();

    // Reseteamos todas las banderas al cerrar el modal
    this.isSubmitting = false;
    this.isValidatingPhone = false;
    this.isAlreadyRegistered = false;
    this.isSuccess = false; // IMPORTANTE: Limpiamos el éxito para la próxima vez
  }

  // 2. Actualiza tu método onSubmit
  onSubmit(): void {
    this.confirmForm.markAllAsTouched();
    // Si ya se envió con éxito o está procesando, no hacemos nada
    if (this.confirmForm.invalid || this.isSubmitting || this.isSuccess) return;


    const telefonoControl = this.confirmForm.get('telefono');
    const telefono = telefonoControl?.value || '';

    this.isValidatingPhone = true;
    this.isAlreadyRegistered = false;

    const urlSinCache = `${this.googleScriptUrl}?telefono=${telefono}&t=${new Date().getTime()}`;

    this.http.get<{ existe: boolean }>(urlSinCache).subscribe({
      next: (res) => {
        this.isValidatingPhone = false;
        if (res.existe) {
          this.isAlreadyRegistered = true;
          telefonoControl?.setErrors({ duplicated: true });
          telefonoControl?.markAsTouched();
          return;
        }

        this.isSubmitting = true;

        // Armamos el payload con el valor booleano de la asistencia
        const payload = {
          nombreCompleto: this.confirmForm.value.nombreCompleto || '',
          telefono,
          fechaRegistro: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
          asistire: this.confirmForm.value.asistencia ? 'SI' : 'NO'
        };

        this.http.post(this.googleScriptUrl, JSON.stringify(payload)).subscribe({
          next: () => {
            alert('¡Asistencia confirmada correctamente!');
            this.closeModal();
          },
          error: () => {
            alert('Hubo un problema al registrar tu asistencia.');
            this.isSubmitting = false;
          }
        });
      },
      error: () => {
        this.isValidatingPhone = false;
        alert('No se pudo verificar el teléfono. Intenta de nuevo.');
      }
    });
  }

}
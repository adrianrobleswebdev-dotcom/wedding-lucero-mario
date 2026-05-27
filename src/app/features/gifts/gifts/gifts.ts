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

  private http = inject(HttpClient);
  isValidatingPhone = false; 
  isAlreadyRegistered = false; 

  private googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwg5US3zf6XDRED2ZYrL5icGmcy1wxcnBSVpz9XfTyKN4USc8_wj6c6j8RNlZMft_-4/exec';

  confirmForm = new FormGroup({
    nombreCompleto: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    ]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]),
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
    
    // IMPORTANTE: Resetear todas las banderas para cuando vuelvan a abrir el modal
    this.isSubmitting = false;
    this.isValidatingPhone = false;
    this.isAlreadyRegistered = false;
  }

  onSubmit(): void {
    this.confirmForm.markAllAsTouched();

    if (this.confirmForm.invalid || this.isSubmitting) return;

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
        const payload = {
          nombreCompleto: this.confirmForm.value.nombreCompleto || '',
          telefono,
          fechaRegistro: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
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
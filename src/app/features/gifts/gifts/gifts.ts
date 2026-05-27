import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-gifts',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gifts.html',
  styleUrl: './gifts.css',
})
export class Gifts {
  isModalOpen = false;

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
  }

  onSubmit(): void {
    if (this.confirmForm.valid) {
      console.log('Formulario enviado:', this.confirmForm.value);
      // Aquí puedes agregar la lógica para enviar los datos
      this.closeModal();
    } else {
      this.confirmForm.markAllAsTouched();
    }
  }


  // Método para permitir solo letras y espacios
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Reemplaza cualquier carácter que NO sea una letra o espacio por una cadena vacía
    let cleanedValue = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    
    // Actualiza el valor en el DOM y en el FormControl
    input.value = cleanedValue;
    this.confirmForm.get('nombreCompleto')?.setValue(cleanedValue, { emitEvent: false });
  }

  // Método para permitir solo números
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Reemplaza cualquier carácter que NO sea un número por una cadena vacía
    let cleanedValue = input.value.replace(/[^0-9]/g, '');
    
    // Actualiza el valor en el DOM y en el FormControl
    input.value = cleanedValue;
    this.confirmForm.get('telefono')?.setValue(cleanedValue, { emitEvent: false });
  }

}

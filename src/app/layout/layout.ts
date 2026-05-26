import { Component } from '@angular/core';
import { Hero } from "../features/hero/hero";
import { SaveTheDateComponent } from "../features/save-the-date/save-the-date.component/save-the-date.component";
import { ScheduleComponent } from '../features/schedule/schedule.component/schedule.component';
import { DressCodeComponent } from "../features/dress-code/dress-code.component/dress-code.component";
import { Hotel } from '../features/hotel/hotel/hotel';
import { Gifts } from '../features/gifts/gifts/gifts';

@Component({
  selector: 'app-layout',
  imports: [Hero, SaveTheDateComponent, ScheduleComponent, DressCodeComponent,Hotel,Gifts],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isPlaying = false;
  audioSrc = '/pictures/CARLOS_RIVERA.mpeg'; // Aquí colocaremos la URL de la canción después

  togglePlay(audio: HTMLAudioElement) {
    if (!audio.src) {
      // Si aún no hay canción, solo alternamos el icono para pruebas visuales
      this.isPlaying = !this.isPlaying;
      return;
    }

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error al intentar reproducir audio:', err);
      });
    }
    this.isPlaying = !this.isPlaying;
  }
}

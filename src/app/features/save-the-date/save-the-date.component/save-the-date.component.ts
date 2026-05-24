import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-save-the-date',
  imports: [],
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
})
export class SaveTheDateComponent implements OnInit, OnDestroy {
  img: string = '/pictures/compressed_3.webp';
  envelopeWrapper: string = "/pictures/letter.webp";
  theWord: string = "/pictures/the.png";

  days: string = '00';
  hours: string = '00';
  minutes: string = '00';

  private timerId: any;
  private targetDate: Date = new Date('2026-08-29T18:00:00'); // 6:00 PM on August 29, 2026

  ngOnInit() {
    this.updateCountdown();
    // Update every second for precision
    this.timerId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.days = '000';
      this.hours = '00';
      this.minutes = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    // Pad with leading zeros (e.g. days can be 3 digits if it's > 99)
    this.days = d.toString().padStart(d > 99 ? 3 : 2, '0');
    this.hours = h.toString().padStart(2, '0');
    this.minutes = m.toString().padStart(2, '0');
  }
}

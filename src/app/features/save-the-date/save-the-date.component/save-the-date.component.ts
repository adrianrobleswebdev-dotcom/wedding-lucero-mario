import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-save-the-date',
  imports: [],
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
})
export class SaveTheDateComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}

  img: string = '/pictures/compressed_3.webp';
  envelopeWrapper: string = "/pictures/letter.webp";
  theWord: string = "/pictures/the.png";

  church: string = ""

  days: string = '00';
  hours: string = '00';
  minutes: string = '00';

  private timerId: any;
  private targetDate: Date = new Date('2026-08-29T18:00:00'); // 6:00 PM on August 29, 2026

  @ViewChild('topContainer') topContainer!: ElementRef;
  @ViewChild('vowsContainer') vowsContainer!: ElementRef;
  isTopVisible: boolean = false;
  isVowsVisible: boolean = false;
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.updateCountdown();
    // Update every second for precision
    this.timerId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === this.topContainer.nativeElement) {
              this.isTopVisible = true;
              this.observer.unobserve(entry.target);
            } else if (entry.target === this.vowsContainer.nativeElement) {
              this.isVowsVisible = true;
              this.observer.unobserve(entry.target);
            }
            this.cdr.detectChanges();
          }
        });
      }, {
        threshold: 0.05 // Triggers when 5% of the element is visible
      });
      
      this.observer.observe(this.topContainer.nativeElement);
      this.observer.observe(this.vowsContainer.nativeElement);
    } else {
      // Fallback for SSR or non-supported browsers
      this.isTopVisible = true;
      this.isVowsVisible = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.observer) {
      this.observer.disconnect();
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




  vowes: string = `Porque creemos que el amor
verdadero encuentra su plenitud
en Dios, queremos consagrar
nuestra unión ante Él y celebrar el
sacramento del matrimonio
rodeados de quienes más amamos.
El amor que Dios sembró en
nuestros corazones nos llama hoy
a unir nuestras vidas ante Sus
ojos, en la promesa más grande:
amarnos para siempre.
Con la bendición de Dios y el amor
que nos une, hemos decidido
consagrar nuestras vidas en el
sagrado sacramento del
matrimonio y compartir este
momento con quienes forman parte
de nuestra historia.`

  get vowesParagraphs(): string[] {
    const text = this.vowes;
    const p1End = text.indexOf("rodeados de quienes más amamos.") + "rodeados de quienes más amamos.".length;
    const p2End = text.indexOf("amarnos para siempre.") + "amarnos para siempre.".length;

    if (p1End > 30 && p2End > p1End) {
      return [
        text.substring(0, p1End).trim(),
        text.substring(p1End, p2End).trim(),
        text.substring(p2End).trim()
      ];
    }
    return [text];
  }





}

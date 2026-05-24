import { Component } from '@angular/core';
import { Hero } from "../features/hero/hero";
import { SaveTheDateComponent } from "../features/save-the-date/save-the-date.component/save-the-date.component";

@Component({
  selector: 'app-layout',
  imports: [Hero, SaveTheDateComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}

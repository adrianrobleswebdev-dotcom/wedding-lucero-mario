import { Component } from '@angular/core';
import { Hero } from "../features/hero/hero";

@Component({
  selector: 'app-layout',
  imports: [Hero],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}

import { Component } from '@angular/core';

import { FavoriteCities } from './components/favoritecities/favoritecities';

@Component({
  selector: 'app-root',
  imports: [FavoriteCities],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}

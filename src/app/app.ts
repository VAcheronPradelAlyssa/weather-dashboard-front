import { Component } from '@angular/core';

import { FavoriteCities } from './components/favoritecities/favoritecities';

@Component({
  selector: 'app-root',
  imports: [FavoriteCities],
  template: '<app-favorite-cities />',
  styleUrl: './app.scss'
})
export class App {
}

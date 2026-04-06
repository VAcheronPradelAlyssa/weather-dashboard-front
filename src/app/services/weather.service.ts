import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FavoriteCity } from '../models/favorite-city.model';
import { Weather } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  getWeatherByCity(city: string): Observable<Weather> {
    const params = new HttpParams().set('city', city);

    return this.http.get<Weather>(`${this.apiUrl}/weather`, { params });
  }

  getFavoriteCities(): Observable<FavoriteCity[]> {
    return this.http.get<FavoriteCity[]>(`${this.apiUrl}/favorite-cities`);
  }

  addFavoriteCity(city: Omit<FavoriteCity, 'id'>): Observable<FavoriteCity> {
    return this.http.post<FavoriteCity>(`${this.apiUrl}/favorite-cities`, city);
  }

  deleteFavoriteCity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite-cities/${id}`);
  }
}
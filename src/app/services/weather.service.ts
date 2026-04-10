import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { FavoriteCityRequestDto, FavoriteCityResponseDto } from '../models/favorite-city.model';
import { WeatherDto } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  getFavoriteCities(userId: number): Observable<FavoriteCityResponseDto[]> {
    return this.http.get<FavoriteCityResponseDto[]>(`${this.apiUrl}/${userId}/favorite-cities`);
  }

  getFavoriteCity(userId: number, favoriteCityId: number): Observable<FavoriteCityResponseDto> {
    return this.http.get<FavoriteCityResponseDto>(`${this.apiUrl}/${userId}/favorite-cities/${favoriteCityId}`);
  }

  getFavoriteCityWeather(userId: number, favoriteCityId: number): Observable<WeatherDto> {
    return this.http.get<WeatherDto>(`${this.apiUrl}/${userId}/favorite-cities/${favoriteCityId}/weather`);
  }

  addFavoriteCity(userId: number, city: FavoriteCityRequestDto): Observable<FavoriteCityResponseDto> {
    return this.http.post<FavoriteCityResponseDto>(`${this.apiUrl}/${userId}/favorite-cities`, city);
  }

  updateFavoriteCity(
    userId: number,
    favoriteCityId: number,
    city: FavoriteCityRequestDto,
  ): Observable<FavoriteCityResponseDto> {
    return this.http.put<FavoriteCityResponseDto>(`${this.apiUrl}/${userId}/favorite-cities/${favoriteCityId}`, city);
  }

  deleteFavoriteCity(userId: number, favoriteCityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/favorite-cities/${favoriteCityId}`);
  }
}
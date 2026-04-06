import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FavoriteCityRequestDto, FavoriteCityResponseDto } from '../models/favorite-city.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

  getFavoriteCities(userId: number): Observable<FavoriteCityResponseDto[]> {
    return this.http.get<FavoriteCityResponseDto[]>(`${this.apiUrl}/${userId}/favorite-cities`);
  }

  getFavoriteCity(userId: number, favoriteCityId: number): Observable<FavoriteCityResponseDto> {
    return this.http.get<FavoriteCityResponseDto>(`${this.apiUrl}/${userId}/favorite-cities/${favoriteCityId}`);
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
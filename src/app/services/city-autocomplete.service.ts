import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })

export class CityAutocompleteService {
  private readonly apiUrl = 'https://weatherdashboardback-production.up.railway.app/api/search-cities';

  constructor(private http: HttpClient) {}

  searchCities(query: string, limit = 5): Observable<CitySuggestion[]> {
    if (!query || query.length < 2) {
      return new Observable<CitySuggestion[]>();
    }
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&limit=${limit}`;
    return this.http.get<CitySuggestion[]>(url);
  }
}

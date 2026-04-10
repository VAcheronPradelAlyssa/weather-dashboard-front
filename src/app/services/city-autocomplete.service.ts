import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })

export class CityAutocompleteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/search-cities`;

  searchCities(query: string, limit = 5): Observable<CitySuggestion[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&limit=${limit}`;
    return this.http.get<CitySuggestion[]>(url);
  }
}

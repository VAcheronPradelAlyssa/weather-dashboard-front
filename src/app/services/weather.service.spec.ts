import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch favorite cities for a user', () => {
    service.getFavoriteCities(42).subscribe((favoriteCities) => {
      expect(favoriteCities).toEqual([]);
    });

    const request = httpTestingController.expectOne('/api/users/42/favorite-cities');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should create a favorite city', () => {
    service.addFavoriteCity(42, { nomVille: 'Paris' }).subscribe((favoriteCity) => {
      expect(favoriteCity).toEqual({
        id: 1,
        nomVille: 'Paris',
        userId: 42,
        dateAjout: '2026-04-06T10:15:30'
      });
    });

    const request = httpTestingController.expectOne('/api/users/42/favorite-cities');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ nomVille: 'Paris' });
    request.flush({
      id: 1,
      nomVille: 'Paris',
      userId: 42,
      dateAjout: '2026-04-06T10:15:30'
    });
  });

  it('should fetch weather for a favorite city', () => {
    service.getFavoriteCityWeather(42, 1).subscribe((weather) => {
      expect(weather).toEqual({
        city: 'Paris',
        description: 'ciel dégagé',
        temperature: 18.4,
        feelsLike: 17.9,
        humidity: 54,
        windSpeed: 3.2,
        icon: '01d'
      });
    });

    const request = httpTestingController.expectOne('/api/users/42/favorite-cities/1/weather');
    expect(request.request.method).toBe('GET');
    request.flush({
      city: 'Paris',
      description: 'ciel dégagé',
      temperature: 18.4,
      feelsLike: 17.9,
      humidity: 54,
      windSpeed: 3.2,
      icon: '01d'
    });
  });

  it('should delete a favorite city', () => {
    service.deleteFavoriteCity(42, 1).subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const request = httpTestingController.expectOne('/api/users/42/favorite-cities/1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
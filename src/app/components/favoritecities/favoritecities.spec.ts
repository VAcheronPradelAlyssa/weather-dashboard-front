import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FavoriteCities } from './favoritecities';
import { WeatherService } from '../../services/weather.service';
import { FavoriteCityResponseDto } from '../../models/favorite-city.model';

describe('FavoriteCities', () => {
  let component: FavoriteCities;
  let fixture: ComponentFixture<FavoriteCities>;

  const favoriteCities: FavoriteCityResponseDto[] = [
    { id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }
  ];

  const deletedCities: Array<[number, number]> = [];

  const weatherServiceSpy = {
    getFavoriteCities: () => of(favoriteCities),
    getFavoriteCity: () => of(favoriteCities[0]),
    getFavoriteCityWeather: () => of({ city: 'Paris', description: 'ciel dégagé', temperature: 18.4, feelsLike: 17.9, humidity: 54, windSpeed: 3.2, icon: '01d' }),
    addFavoriteCity: () => of(favoriteCities[0]),
    updateFavoriteCity: () => of(favoriteCities[0]),
    deleteFavoriteCity: (userId: number, cityId: number) => {
      deletedCities.push([userId, cityId]);
      return of(void 0);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: WeatherService, useValue: weatherServiceSpy }],
      imports: [FavoriteCities],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteCities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the favorite city list and weather', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h3')?.textContent).toContain('Paris');
    expect(compiled.textContent).toContain('ciel dégagé');
    expect(compiled.textContent).toContain('18.4');
  });

  it('should remove a city from the dashboard when delete is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('button.delete-button');

    deleteButton?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(deletedCities).toEqual([[42, 1]]);
    expect(compiled.querySelector('.city-card')).toBeNull();
  });
});

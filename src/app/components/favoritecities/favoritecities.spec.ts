import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FavoriteCities } from './favoritecities';
import { WeatherService } from '../../services/weather.service';

describe('FavoriteCities', () => {
  let component: FavoriteCities;
  let fixture: ComponentFixture<FavoriteCities>;

  const weatherServiceSpy = {
    getFavoriteCities: () => of([]),
    getFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
    addFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
    updateFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
    deleteFavoriteCity: () => of(void 0),
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
});

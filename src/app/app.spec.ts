import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WeatherService } from './services/weather.service';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: WeatherService,
        useValue: {
          getFavoriteCities: () => of([]),
          getFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
          getFavoriteCityWeather: () => of({ city: 'Paris', description: 'ciel dégagé', temperature: 18.4, feelsLike: 17.9, humidity: 54, windSpeed: 3.2, icon: '01d' }),
          addFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
          updateFavoriteCity: () => of({ id: 1, nomVille: 'Paris', userId: 42, dateAjout: '2026-04-06T10:15:30' }),
          deleteFavoriteCity: () => of(void 0),
        }
      }],
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render favorite cities page', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Villes favorites');
  });
});

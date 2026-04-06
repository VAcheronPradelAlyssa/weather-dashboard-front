import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { FavoriteCityRequestDto, FavoriteCityResponseDto } from '../../models/favorite-city.model';
import { WeatherDto } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-favorite-cities',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './favoritecities.html',
  styleUrl: './favoritecities.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteCities implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly userId = signal(42);

  protected readonly favoriteCities = signal<FavoriteCityResponseDto[]>([]);
  protected readonly weatherByCityId = signal<Record<number, WeatherDto>>({});
  protected readonly weatherLoadingByCityId = signal<Record<number, boolean>>({});
  protected readonly weatherErrorByCityId = signal<Record<number, string | null>>({});
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    nomVille: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.loadFavoriteCities();
  }

  protected loadFavoriteCities(): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getFavoriteCities(this.userId()).subscribe({
      next: (favoriteCities) => {
        this.favoriteCities.set(favoriteCities);
        this.loadWeatherForCities(favoriteCities);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les villes favorites.');
        this.loading.set(false);
      }
    });
  }

  protected loadWeatherForCity(city: FavoriteCityResponseDto): void {
    this.weatherLoadingByCityId.update((currentState) => ({
      ...currentState,
      [city.id]: true
    }));
    this.weatherErrorByCityId.update((currentState) => ({
      ...currentState,
      [city.id]: null
    }));

    this.weatherService.getFavoriteCityWeather(this.userId(), city.id).subscribe({
      next: (weather) => {
        this.weatherByCityId.update((currentState) => ({
          ...currentState,
          [city.id]: weather
        }));
        this.weatherLoadingByCityId.update((currentState) => ({
          ...currentState,
          [city.id]: false
        }));
      },
      error: () => {
        this.weatherErrorByCityId.update((currentState) => ({
          ...currentState,
          [city.id]: 'Météo indisponible pour le moment.'
        }));
        this.weatherLoadingByCityId.update((currentState) => ({
          ...currentState,
          [city.id]: false
        }));
      }
    });
  }

  protected loadWeatherForCities(favoriteCities: FavoriteCityResponseDto[]): void {
    if (favoriteCities.length === 0) {
      this.weatherByCityId.set({});
      this.weatherLoadingByCityId.set({});
      this.weatherErrorByCityId.set({});
      return;
    }

    this.weatherByCityId.set({});
    this.weatherLoadingByCityId.set(
      Object.fromEntries(favoriteCities.map((city) => [city.id, true])) as Record<number, boolean>
    );
    this.weatherErrorByCityId.set({});

    forkJoin(favoriteCities.map((city) => this.weatherService.getFavoriteCityWeather(this.userId(), city.id)))
      .subscribe({
        next: (weatherList) => {
          const nextWeatherByCityId = favoriteCities.reduce<Record<number, WeatherDto>>((accumulator, city, index) => {
            accumulator[city.id] = weatherList[index];
            return accumulator;
          }, {});

          this.weatherByCityId.set(nextWeatherByCityId);
          this.weatherLoadingByCityId.set({});
        },
        error: () => {
          favoriteCities.forEach((city) => this.loadWeatherForCity(city));
        }
      });
  }

  protected addFavoriteCity(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const { nomVille } = this.form.getRawValue();
    const cityToCreate: FavoriteCityRequestDto = {
      nomVille: nomVille.trim()
    };

    this.saving.set(true);
    this.error.set(null);

    this.weatherService.addFavoriteCity(this.userId(), cityToCreate).subscribe({
      next: (createdCity) => {
        this.favoriteCities.update((currentCities) => [createdCity, ...currentCities]);
        this.loadWeatherForCity(createdCity);
        this.form.reset({ nomVille: '' });
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Impossible d’ajouter la ville.');
        this.saving.set(false);
      }
    });
  }

  protected removeFavoriteCity(cityId: number): void {
    this.error.set(null);

    this.weatherService.deleteFavoriteCity(this.userId(), cityId).subscribe({
      next: () => {
        this.favoriteCities.update((currentCities) => currentCities.filter((city) => city.id !== cityId));
        this.weatherByCityId.update((currentState) => {
          const { [cityId]: _, ...remainingState } = currentState;
          return remainingState;
        });
        this.weatherLoadingByCityId.update((currentState) => {
          const { [cityId]: _, ...remainingState } = currentState;
          return remainingState;
        });
        this.weatherErrorByCityId.update((currentState) => {
          const { [cityId]: _, ...remainingState } = currentState;
          return remainingState;
        });
      },
      error: () => {
        this.error.set('Impossible de supprimer la ville.');
      }
    });
  }

  protected weatherForCity(cityId: number): WeatherDto | undefined {
    return this.weatherByCityId()[cityId];
  }

  protected weatherLoadingForCity(cityId: number): boolean {
    return this.weatherLoadingByCityId()[cityId] ?? false;
  }

  protected weatherErrorForCity(cityId: number): string | null {
    return this.weatherErrorByCityId()[cityId] ?? null;
  }

  protected trackByCityId(_: number, city: FavoriteCityResponseDto): number {
    return city.id;
  }
}
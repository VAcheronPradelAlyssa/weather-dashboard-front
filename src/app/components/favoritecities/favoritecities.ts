import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FavoriteCity } from '../../models/favorite-city.model';
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

  protected readonly favoriteCities = signal<FavoriteCity[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    countryCode: ['', [Validators.maxLength(2)]],
  });

  ngOnInit(): void {
    this.loadFavoriteCities();
  }

  protected loadFavoriteCities(): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getFavoriteCities().subscribe({
      next: (favoriteCities) => {
        this.favoriteCities.set(favoriteCities);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les villes favorites.');
        this.loading.set(false);
      }
    });
  }

  protected addFavoriteCity(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, countryCode } = this.form.getRawValue();
    const cityToCreate = {
      name: name.trim(),
      ...(countryCode.trim() ? { countryCode: countryCode.trim().toUpperCase() } : {})
    };

    this.saving.set(true);
    this.error.set(null);

    this.weatherService.addFavoriteCity(cityToCreate).subscribe({
      next: (createdCity) => {
        this.favoriteCities.update((currentCities) => [createdCity, ...currentCities]);
        this.form.reset({ name: '', countryCode: '' });
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Impossible d’ajouter la ville.');
        this.saving.set(false);
      }
    });
  }

  protected removeFavoriteCity(cityId: string): void {
    this.error.set(null);

    this.weatherService.deleteFavoriteCity(cityId).subscribe({
      next: () => {
        this.favoriteCities.update((currentCities) => currentCities.filter((city) => city.id !== cityId));
      },
      error: () => {
        this.error.set('Impossible de supprimer la ville.');
      }
    });
  }

  protected trackByCityId(_: number, city: FavoriteCity): string {
    return city.id;
  }
}
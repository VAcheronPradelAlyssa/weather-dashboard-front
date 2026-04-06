export interface FavoriteCityRequestDto {
  nomVille: string;
}

export interface FavoriteCityResponseDto {
  id: number;
  nomVille: string;
  userId: number;
  dateAjout: string;
}

export type FavoriteCity = FavoriteCityResponseDto;
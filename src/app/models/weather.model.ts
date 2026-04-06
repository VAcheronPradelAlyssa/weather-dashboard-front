export interface WeatherDto {
  city: string;
  description: string;
  temperature: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
}
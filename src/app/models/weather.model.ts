export interface Weather {
  cityName: string;
  temperature: number;
  description: string;
  feelsLike?: number;
  humidity?: number;
  icon?: string;
  pressure?: number;
  windSpeed?: number;
}
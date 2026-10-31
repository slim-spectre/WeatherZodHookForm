export interface WeatherData {
  searchedCity: string;
  temperature: string | number;
  description: string;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  error: string;
}
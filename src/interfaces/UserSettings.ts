export interface UserSettings {
  textColor: string;
  bgColor: string;
  favoriteCity: string;
  favoriteCountry: string; 
}
export const DEFAULT_SETTINGS: UserSettings = {
  textColor: '#0f172a', 
  bgColor: '#fef3c7',   
  favoriteCity: '',
  favoriteCountry: ''
};
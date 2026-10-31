import type { UserSettings } from '../interfaces/UserSettings'
import { DEFAULT_SETTINGS } from '../interfaces/UserSettings'
import { useEffect, useState } from 'react'


export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try{
      const savedSetting = localStorage.getItem("weatherUserSettings");
      return savedSetting ? JSON.parse(savedSetting) : DEFAULT_SETTINGS;
    }catch(err){
      console.error("Couldnt read");
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    try{
      localStorage.setItem("weatherUserSettings", JSON.stringify(settings));
    }catch(err){
      console.error(err)
    }
  },[settings])

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
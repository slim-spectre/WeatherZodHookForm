import { z } from 'zod'
import { useForm } from 'react-hook-form'
import type { WeatherData } from '../interfaces/WeatherData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useUserSettings } from '../hooks/useUserSettings'

const formSchema = z.object({
  city: z.string().min(2, 'City must be written and have miminum 2 symbols'),
  country: z.string().length(2, 'Code of country must be like UA, US'),
})

type FormData = z.infer<typeof formSchema>

export const Weather = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { settings, updateSetting } = useUserSettings()

  useEffect(() => {
    if (settings.favoriteCity) {
      setValue('city', settings.favoriteCity)
    }
    if (settings.favoriteCountry) {
      setValue('country', settings.favoriteCountry)
    }
  }, [settings.favoriteCity, settings.favoriteCountry, setValue])

  const [apiData, setApiData] = useState<WeatherData | null>()

  const customSubmit = async (data: FormData) => {
    try {
      const key = import.meta.env.VITE_API_KEY
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${data.city},${data.country}&appid=${key}&units=metric&lang=ua`,
      )
      if (!response.ok) throw new Error('The fetch failed')
      const result = await response.json()
      const formatTime = (unixTimestamp: number) => {
        return new Date(unixTimestamp * 1000).toLocaleTimeString('uk-UA', {
          hour: '2-digit',
          minute: '2-digit',
        })
      }
      const now = result.dt
      const sunrise = result.sys.sunrise
      const sunset = result.sys.sunset
      const isDay = now >= sunrise && now < sunset
      setApiData({
        searchedCity: `${result.name}, ${result.sys.country}`,
        temperature: result.main.temp,
        description: result.weather[0].description,
        sunrise: formatTime(result.sys.sunrise),
        sunset: formatTime(result.sys.sunset),
        isDay: isDay,
        error: '',
      })
    } catch (error) {
      setApiData({
        searchedCity: '',
        temperature: '',
        description: '',
        sunrise: '',
        sunset: '',
        isDay: false,
        error: 'Could not find weather for this city',
      })
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: settings.bgColor, color: settings.textColor }}>
      <h1>Here you can enter your city to access weather</h1>
      {apiData && !apiData.error && (
        <div>
          <p className="font-bold text-amber-500">
            Weather in {apiData.searchedCity} : {apiData.temperature} degrees celcius
          </p>
          <p className="font-bold text-amber-500">Description of weather : {apiData.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-blue-700">
            <p>
              Sunsirse: <span className="font-bold">{apiData.sunrise}</span>
            </p>
            <p>
              Sunset: <span className="font-bold">{apiData.sunset}</span>
            </p>
          </div>
          {apiData.isDay ? <img src="/sun.jpg"></img> : <img src="moon.jpg"></img>}
        </div>
      )}
      {apiData?.error && <p className="font-bold text-red-500 mb-4">{apiData.error}</p>}

      <form className="flex flex-col gap-1 bg-amber-100 rounded-2xl p-2" onSubmit={handleSubmit(customSubmit)}>
        <input
          className="p-1 border-amber-100 text-cyan-700"
          {...register('country')}
          placeholder="Country"
          type="text"
        />
        {errors.country && <p className="text-red-500">{errors.country.message}</p>}
        <input className="p-1 border-amber-100 text-cyan-700" {...register('city')} placeholder="City" type="text" />
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        <button className="p-2 border-none bg-amber-950" type="submit">
          Get weather
        </button>
      </form>

      <div className="mt-8 p-4 border rounded-xl bg-white/50 backdrop-blur-sm">
        <h2 className="text-lg font-bold mb-3">Налаштування</h2>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            bg color:
            <input type="color" value={settings.bgColor} onChange={(e) => updateSetting('bgColor', e.target.value)} />
          </label>

          <label className="flex items-center gap-2 text-sm">
            text color:
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting('textColor', e.target.value)}
            />
          </label>

          <div className="flex flex-col gap-1 mt-2">
            <span className="text-sm">Favorite town:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Town (for expample Kyiv)"
                className="p-1 border text-black rounded flex-1"
                value={settings.favoriteCity}
                onChange={(e) => updateSetting('favoriteCity', e.target.value)}
              />
              <input
                type="text"
                placeholder="Code (UA)"
                className="p-1 border text-black rounded w-16 text-center"
                maxLength={2}
                value={settings.favoriteCountry}
                onChange={(e) => updateSetting('favoriteCountry', e.target.value.toUpperCase())}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

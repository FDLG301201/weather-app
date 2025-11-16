'use server'

export interface WeatherData {
  name: string
  country: string
  temperature: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  description: string
  windSpeed: number
  windDeg: number | null
  pressure: number
  visibility: number
  clouds: number
  rainLastHour: number | null
  sunrise: number
  sunset: number
  timezone: number
  updatedAt: number
}

export async function searchWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  
  if (!apiKey) {
    throw new Error('API key no configurada. Por favor agrega OPENWEATHER_API_KEY en las variables de entorno.')
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ciudad no encontrada. Por favor verifica el nombre e intenta de nuevo.')
    }
    throw new Error('Error al obtener los datos del clima. Por favor intenta de nuevo.')
  }

  const data = await response.json()

  return {
    name: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    windDeg: data.wind.deg ?? null,
    pressure: data.main.pressure,
    visibility: data.visibility,
    clouds: data.clouds.all,
    rainLastHour: data.rain?.['1h'] ?? null,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    updatedAt: data.dt,
  }
}

import { searchWeather } from '@/lib/weather-api'

// Mock de fetch global
global.fetch = jest.fn()

describe('searchWeather API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('retorna datos del clima correctamente', async () => {
    const mockResponse = {
      name: 'Madrid',
      sys: {
        country: 'ES',
        sunrise: 1700123456,
        sunset: 1700163456,
      },
      main: {
        temp: 23,
        feels_like: 21,
        temp_min: 20,
        temp_max: 24,
        humidity: 65,
        pressure: 1013,
      },
      weather: [
        {
          description: 'cielo claro',
        },
      ],
      wind: {
        speed: 3.5,
        deg: 90,
      },
      clouds: {
        all: 0,
      },
      visibility: 10000,
      timezone: 3600,
      dt: 1700130000,
      rain: {
        '1h': 0,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await searchWeather('Madrid')

    expect(result).toEqual({
      name: 'Madrid',
      country: 'ES',
      temperature: 23,
      feelsLike: 21,
      tempMin: 20,
      tempMax: 24,
      humidity: 65,
      pressure: 1013,
      visibility: 10000,
      description: 'cielo claro',
      windSpeed: 3.5,
      windDeg: 90,
      clouds: 0,
      sunrise: 1700123456,
      sunset: 1700163456,
      timezone: 3600,
      updatedAt: 1700130000,
      rainLastHour: 0,
    })
  })

  test('maneja el error cuando la ciudad no se encuentra', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'city not found' }),
    })

    await expect(searchWeather('CiudadInvalida')).rejects.toThrow(
      'Ciudad no encontrada. Por favor verifica el nombre e intenta de nuevo.'
    )
  })

  test('maneja errores de red', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    await expect(searchWeather('Madrid')).rejects.toThrow()
  })

  test('maneja datos faltantes en la respuesta', async () => {
    const mockResponse = {
      name: 'Madrid',
      sys: {
        country: 'ES',
      },
      main: {
        temp: 23,
        feels_like: 21,
        temp_min: 20,
        temp_max: 24,
        humidity: 65,
      },
      weather: [
        {
          description: 'cielo claro',
        },
      ],
      wind: {
        speed: 3.5,
      },
      clouds: {
        all: 0,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await searchWeather('Madrid')

    expect(result).toMatchObject({
      name: 'Madrid',
      country: 'ES',
      temperature: 23,
      feelsLike: 21,
      description: 'cielo claro',
      windSpeed: 3.5,
      clouds: 0,
    })
  })
})
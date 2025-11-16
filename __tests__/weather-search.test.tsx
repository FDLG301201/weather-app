import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeatherSearch } from '@/components/weather-search'
import { searchWeather } from '@/lib/weather-api'
import type { WeatherData } from '@/lib/weather-api'
import '@testing-library/jest-dom'

// Mock del módulo weather-api
jest.mock('@/lib/weather-api', () => ({
  searchWeather: jest.fn(),
}))

const mockSearchWeather = searchWeather as jest.MockedFunction<typeof searchWeather>

const baseWeatherData: WeatherData = {
  name: 'Madrid',
  country: 'ES',
  temperature: 22,
  feelsLike: 21,
  tempMin: 20,
  tempMax: 24,
  humidity: 65,
  pressure: 1013,
  visibility: 10000,
  description: 'cielo claro',
  windSpeed: 3.5,
  windDeg: 90,
  rainLastHour: 0.2,
  clouds: 25,
  sunrise: 1700123456,
  sunset: 1700163456,
  timezone: 3600,
  updatedAt: 1700130000,
}

const buildWeatherData = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  ...baseWeatherData,
  ...overrides,
})

describe('WeatherSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renderiza el formulario de búsqueda correctamente', () => {
    render(<WeatherSearch />)
    
    const cityInput = screen.getByTestId('city-input')
    const searchButton = screen.getByTestId('search-button')
    const placeholder = screen.getByPlaceholderText(/Ej: Madrid/i)
    
    expect(cityInput).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
    expect(placeholder).toBeInTheDocument()
  })

  test('muestra la información del clima después de una búsqueda exitosa', async () => {
    const user = userEvent.setup()
    mockSearchWeather.mockResolvedValueOnce(buildWeatherData())

    render(<WeatherSearch />)
    
    const inputElement = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')

    await user.type(inputElement, 'Madrid')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('weather-display')).toBeInTheDocument()
    })

    // Verificar nombre de ciudad
    expect(screen.getByText('Madrid')).toBeInTheDocument()
    
    // Verificar país (está en un Chip)
    expect(screen.getByText('ES')).toBeInTheDocument()
    
    // Verificar descripción del clima
    expect(screen.getByText('cielo claro')).toBeInTheDocument()

    // Verificar temperatura
    const temperature = screen.getByTestId('temperature')
    expect(temperature).toBeInTheDocument()
    expect(temperature).toHaveTextContent('22°C')
    
    // Verificar sensación térmica y min/max
    expect(screen.getByText(/Sensación térmica:/i)).toBeInTheDocument()
    expect(screen.getByText(/21°C/i)).toBeInTheDocument()
    expect(screen.getByText(/Mín:.*20°C.*Máx:.*24°C/i)).toBeInTheDocument()
    
    // Verificar humedad
    expect(screen.getByText('Humedad')).toBeInTheDocument()
    const humidity = screen.getByTestId('humidity')
    expect(humidity).toHaveTextContent('65%')
    
    // Verificar viento
    expect(screen.getByText('Viento')).toBeInTheDocument()
    expect(screen.getByText('3.5 m/s')).toBeInTheDocument()
    expect(screen.getByText(/Dirección:.*E/i)).toBeInTheDocument()
    
    // Verificar que la función fue llamada correctamente
    expect(mockSearchWeather).toHaveBeenCalledWith('Madrid')
    expect(mockSearchWeather).toHaveBeenCalledTimes(1)
  })

  test('maneja correctamente un error cuando se ingresa un nombre de ciudad inválido', async () => {
    const user = userEvent.setup()
    mockSearchWeather.mockRejectedValueOnce(
      new Error('Ciudad no encontrada. Por favor verifica el nombre e intenta de nuevo.')
    )

    render(<WeatherSearch />)
    
    const inputElement = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')

    await user.type(inputElement, 'CiudadInvalida123')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    const errorMessage = screen.getByText(/Ciudad no encontrada/i)
    expect(errorMessage).toBeInTheDocument()
  })

  test('el campo de entrada y el botón de búsqueda funcionan correctamente', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const inputElement = screen.getByTestId('city-input') as HTMLInputElement
    const button = screen.getByTestId('search-button')

    // Verificar que el input comienza vacío
    expect(inputElement.value).toBe('')
    
    await user.type(inputElement, 'Barcelona')
    
    // Verificar que el texto se ingresó correctamente
    expect(inputElement.value).toBe('Barcelona')
    expect(button).toBeEnabled()
  })

  test('muestra error cuando el campo de entrada está vacío', async () => {
    const user = userEvent.setup()
    render(<WeatherSearch />)
    
    const button = screen.getByTestId('search-button')

    await user.click(button)

    await waitFor(() => {
      const errorElement = screen.queryByText(/Por favor ingresa el nombre de una ciudad/i)
      if (errorElement) {
        expect(errorElement).toBeInTheDocument()
      } else {
        const errorMessage = screen.queryByTestId('error-message')
        expect(errorMessage).toBeInTheDocument()
      }
    })

    expect(mockSearchWeather).not.toHaveBeenCalled()
  })

  test('deshabilita el botón durante la búsqueda', async () => {
    const user = userEvent.setup()
    mockSearchWeather.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(buildWeatherData()), 100)
        )
    )

    render(<WeatherSearch />)
    
    const inputElement = screen.getByTestId('city-input')
    const button = screen.getByTestId('search-button')

    await user.type(inputElement, 'Madrid')
    await user.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
    })
    
    const loadingText = screen.getByText('Buscando')
    expect(loadingText).toBeInTheDocument()

    await waitFor(() => {
      expect(button).toBeEnabled()
    }, { timeout: 3000 })
  })
})
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material'
import {
  Search,
  Cloud,
  WaterDrop,
  Air,
  Thermostat,
  Visibility,
  WbSunny,
  NightsStay,
  Grain,
  Speed,
  CloudQueue,
  Navigation,
} from '@mui/icons-material'
import { searchWeather } from '@/lib/weather-api'
import type { WeatherData } from '@/lib/weather-api'

export function WeatherSearch() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const formatLocalTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
  }

  const getWindDirection = (degrees: number | null) => {
    if (degrees === null) return '—'
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
    const index = Math.round(degrees / 45) % directions.length
    return directions[index]
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!city.trim()) {
      setError('Por favor ingresa el nombre de una ciudad')
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      const data = await searchWeather(city)
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar el clima')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Buscar Ciudad
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingresa el nombre de una ciudad para ver su clima
          </Typography>
          
          <Box
            component="form"
            onSubmit={handleSearch}
            data-testid="weather-form"
            sx={{ display: 'flex', gap: 1 }}
          >
            <TextField
              fullWidth
              placeholder="Ej: Madrid, Buenos Aires, México..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
              inputProps={{ 'data-testid': 'city-input' }}
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              data-testid="search-button"
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Buscando' : 'Buscar'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" data-testid="error-message">
          {error}
        </Alert>
      )}

      {weather && (
        <Card elevation={3} data-testid="weather-display">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {weather.name}
              </Typography>
              <Chip label={weather.country} size="small" color="primary" />
            </Box>
            
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textTransform: 'capitalize', mb: 3 }}
            >
              {weather.description}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Cloud sx={{ fontSize: 80, color: 'primary.main', mb: 1 }} />
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 700 }}
                  data-testid="temperature"
                >
                  {weather.temperature}°C
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Sensación térmica: <strong>{weather.feelsLike}°C</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Mín: {weather.tempMin}°C / Máx: {weather.tempMax}°C
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <WaterDrop sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Humedad
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600 }}
                          data-testid="humidity"
                        >
                          {weather.humidity}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Air sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Viento
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {weather.windSpeed} m/s
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Dirección: {getWindDirection(weather.windDeg)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Speed sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Presión
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {weather.pressure} hPa
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Visibility sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Visibilidad
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {(weather.visibility / 1000).toFixed(1)} km
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6, md: 4}}>
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CloudQueue sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Nubosidad
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {weather.clouds}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6, md: 4}} >
                <Card variant="outlined" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Grain sx={{ fontSize: 36, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Lluvia (1h)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {weather.rainLastHour != null ? `${weather.rainLastHour} mm` : '0 mm'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 6}}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%)',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WbSunny sx={{ fontSize: 48, color: 'warning.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Amanecer
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {formatLocalTime(weather.sunrise, weather.timezone)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 12, sm: 6}}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: 'linear-gradient(135deg, rgba(63, 81, 181, 0.2) 0%, rgba(103, 58, 183, 0.2) 100%)',
                    border: '1px solid rgba(63, 81, 181, 0.3)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <NightsStay sx={{ fontSize: 48, color: 'secondary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Atardecer
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {formatLocalTime(weather.sunset, weather.timezone)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Zona horaria: UTC{weather.timezone >= 0 ? '+' : ''}
                {(weather.timezone / 3600).toFixed(1)} • Última actualización:{' '}
                {formatLocalTime(weather.updatedAt, weather.timezone)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

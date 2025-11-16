import { WeatherSearch } from '@/components/weather-search'
import { Container, Typography, Box } from '@mui/material'

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Aplicación del Clima
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Busca el clima actual de cualquier ciudad del mundo
          </Typography>
        </Box>
        <WeatherSearch />
      </Container>
    </Box>
  )
}

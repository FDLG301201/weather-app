# Aplicación del Clima ⛅

Una aplicación simple de clima construida con Next.js que permite a los usuarios buscar el clima actual de cualquier ciudad del mundo.

## Características

- 🔍 Búsqueda de clima por nombre de ciudad
- 🌡️ Muestra temperatura actual y sensación térmica
- 💧 Información de humedad
- 🌬️ Velocidad del viento
- ⚠️ Manejo de errores robusto
- ✅ Pruebas unitarias con 80%+ de cobertura
- 🎨 Interfaz moderna con Material UI

## Requisitos Previos

- Node.js 18+ instalado
- Una API key de OpenWeatherMap (gratuita en https://openweathermap.org/api)

## Instalación

1. Clona o descarga este proyecto

2. Instala las dependencias:
\`\`\`pnpm install\`\`\`

3. Configura tu API key de OpenWeatherMap:

**En desarrollo local:**
Crea un archivo `.env.local` en la raíz del proyecto:
\`\`\`
OPENWEATHER_API_KEY=tu_api_key_aqui
\`\`\`

**Nota de Seguridad:** La API key se maneja de forma segura en el servidor usando Server Actions y nunca se expone al cliente.

## Ejecutar la Aplicación

### Modo Desarrollo
\`\`\`pnpm dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo Producción
\`\`\`bash
pnmp build build
pnpm dev
\`\`\`

## Ejecutar las Pruebas

### Ejecutar todas las pruebas
\`\`\`
pnpm test
\`\`\`

### Ejecutar pruebas en modo watch
\`\`\`
pnpm test:watch
\`\`\`

### Ejecutar pruebas con reporte de cobertura
\`\`\`
pnpm test:coverage
\`\`\`

El reporte de cobertura se generará en la carpeta `coverage/`.

## Tecnologías Utilizadas


- **Next.js 16** - Framework de React
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Material UI 6** - Componentes de UI modernos
- **Emotion** - CSS-in-JS para Material UI
- **Jest** - Framework de pruebas
- **React Testing Library** - Pruebas de componentes
- **OpenWeatherMap API** - Datos del clima

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página de inicio
│   ├── theme-provider.tsx  # Configuración de tema Material UI
│   └── globals.css         # Estilos globales
├── components/
│   ├── weather-search.tsx  # Componente principal de búsqueda
│   └── ui/                 # Componentes de UI (shadcn)
├── lib/
│   └── weather-api.ts      # Server Action para API del clima
├── __tests__/
│   ├── weather-search.test.tsx  # Pruebas del componente
│   └── weather-api.test.ts      # Pruebas de la API
├── jest.config.js          # Configuración de Jest
├── jest.setup.js           # Setup de Jest
└── package.json
\`\`\`

## Pruebas Incluidas

1. ✅ Renderizado correcto del formulario de búsqueda
2. ✅ Muestra información del clima después de búsqueda exitosa
3. ✅ Manejo de errores para ciudades inválidas
4. ✅ Funcionalidad del campo de entrada y botón
5. ✅ Validación de campo vacío
6. ✅ Estado de carga durante la búsqueda
7. ✅ Pruebas de la función de API
8. ✅ Manejo de errores de API

## Cobertura de Pruebas

El proyecto está configurado para mantener una cobertura mínima del 80% en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)

## Obtener una API Key de OpenWeatherMap

1. Ve a https://openweathermap.org/api
2. Crea una cuenta gratuita
3. Ve a "API keys" en tu perfil
4. Copia tu API key
5. Agrégala en la sección **Vars** de v0 o en tu archivo `.env.local`

## Despliegue en Vercel

Para desplegar la aplicación:

1. Haz clic en el botón "Publish" en la interfaz de v0
2. Asegúrate de agregar la variable de entorno `OPENWEATHER_API_KEY` en la configuración de tu proyecto Vercel

## Licencia

MIT

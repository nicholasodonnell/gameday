export const loader = () => ({
  APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
  BITRATE: process.env.BITRATE ?? '5600',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  MLB_AUTH_URL: process.env.MLB_AUTH_URL ?? 'https://ids.mlb.com',
  MLB_MASTAPI_URL: process.env.MLB_MASTAPI_URL ?? 'https://mastapi.mobile.mlbinfra.com',
  MLB_MEDIA_GATEWAY_URL: process.env.MLB_MEDIA_GATEWAY_URL ?? 'https://media-gateway.mlb.com',
  MLB_STATIC_URL: process.env.MLB_STATIC_URL ?? 'https://midfield.mlbstatic.com',
  TZ: process.env.TZ ?? 'UTC',
})

import rateLimit from 'express-rate-limit';

/**
 * Middleware para limitar la cantidad de intentos de login desde una misma IP.
 * Esto ayuda a prevenir ataques de fuerza bruta.
 * 
 * Configuración:
 * - windowMs: ventana de tiempo en milisegundos (15 minutos)
 * - max: máximo número de intentos permitidos en la ventana (10)
 * - message: mensaje de error enviado cuando se excede el límite
 * - standardHeaders: habilita cabeceras estándar RateLimit
 * - legacyHeaders: deshabilita cabeceras legacy
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por ventana
  message: {
    error: 'Demasiados intentos de login desde esta IP, por favor intente nuevamente después de 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
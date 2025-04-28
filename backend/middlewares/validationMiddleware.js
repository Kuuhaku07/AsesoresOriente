import { validationResult } from 'express-validator';


/**
 * Middleware para validar los resultados de las validaciones definidas en las rutas.
 * Si existen errores de validación, responde con estado 400 y los errores en formato JSON.
 * Si no hay errores, continúa con el siguiente middleware o controlador.
 */

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

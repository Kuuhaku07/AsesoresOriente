import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware para manejar errores de multer, especialmente el filtro de archivos
export const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.message === 'Solo se permiten imágenes JPEG y PNG' || err.message === 'Solo se permiten documentos PDF, DOC, XLS, TXT') {
      return res.status(400).json({ error: err.message });
    }
    // Otros errores de multer pueden manejarse aquí
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
  next();
};

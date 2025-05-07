/**
 * Funciones utilitarias para validación y manejo de mensajes de error en frontend
 */

const messages = {
  required: (field) => 'El campo ' + field + ' es obligatorio.',
  minLength: (field, min) => 'El campo ' + field + ' debe tener al menos ' + min + ' caracteres.',
  maxLength: (field, max) => 'El campo ' + field + ' no puede exceder los ' + max + ' caracteres.',
  email: (field) => 'El formato del correo electrónico en ' + field + ' es inválido.',
  numeric: (field) => 'El campo ' + field + ' debe ser numérico.',
  pattern: (field, message) => message || 'El campo ' + field + ' tiene un formato inválido.',
  in: (field) => 'El valor seleccionado para ' + field + ' no es válido.',
  date: (field) => 'El campo ' + field + ' debe ser una fecha válida.',
};

/**
 * Valida un objeto de datos contra un objeto de reglas.
 * Ejemplo de reglas:
 * {
 *   email: { required: true, email: true },
 *   age: { required: true, numeric: true, min: 18 }
 * }
 * Retorna un arreglo con mensajes de error.
 */
export function validateData(data, rules) {
  const errors = [];

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    // Validar campo requerido
    if (fieldRules.required) {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        errors.push(messages.required(field));
        continue; // saltar otras validaciones si falla requerido
      }
    }

    // Validar longitud mínima
    if (fieldRules.min && typeof value === 'string' && value.length < fieldRules.min) {
      errors.push(messages.minLength(field, fieldRules.min));
    }

    // Validar longitud máxima
    if (fieldRules.max && typeof value === 'string' && value.length > fieldRules.max) {
      errors.push(messages.maxLength(field, fieldRules.max));
    }

    // Validar formato de email
    if (fieldRules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        errors.push(messages.email(field));
      }
    }

    // Validar valor numérico
    if (fieldRules.numeric) {
      if (value !== undefined && value !== null && isNaN(Number(value))) {
        errors.push(messages.numeric(field));
      }
    }

    // Validar patrón regex personalizado
    if (fieldRules.pattern) {
      if (typeof value === 'string' && !fieldRules.pattern.regex.test(value)) {
        errors.push(messages.pattern(field, fieldRules.pattern.message));
      }
    }

    // Validar que el valor esté dentro de un conjunto permitido
    if (fieldRules.in) {
      if (!fieldRules.in.includes(value)) {
        errors.push(messages.in(field));
      }
    }

    // Validar formato de fecha
    if (fieldRules.date) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push(messages.date(field));
      }
    }
  }

  return errors;
}

/**
 * Crea un objeto de mensaje para enviar en la respuesta.
 * @param {string} type - Tipo de mensaje (ej. 'error', 'success')
 * @param {string} content - Contenido del mensaje
 * @returns {object} Objeto con tipo y contenido del mensaje
 */
export function setMessage(type, content) {
  return { type, content };
}

import { validateData, setMessage } from './validationUtils.js';

function runTests() {
  // Test case with valid data
  const validData = {
    email: 'test@example.com',
    age: '25',
    username: 'user123',
    birthdate: '1990-01-01',
    phone: '1234567890',
  };

  const rules = {
    email: { required: true, email: true },
    age: { required: true, numeric: true, min: 2 },
    username: { required: true, min: 3, max: 10 },
    birthdate: { required: true, date: true },
    phone: { pattern: { regex: /^[0-9]{10}$/, message: 'El teléfono debe tener 10 dígitos.' } },
  };

  const validErrors = validateData(validData, rules);
  if (validErrors.length === 0) {
    console.log('Valid data: All validations passed.');
  } else {
    console.log('Valid data: Validation errors:', validErrors);
  }

  // Test case with invalid data to trigger validation errors
  const invalidData = {
    email: 'invalid-email',
    age: 'abc',
    username: 'us',
    birthdate: 'invalid-date',
    phone: '12345',
  };

  const invalidErrors = validateData(invalidData, rules);
  if (invalidErrors.length === 0) {
    console.log('Invalid data: All validations passed (unexpected).');
  } else {
    console.log('Invalid data: Validation errors:', invalidErrors);
  }

  const msg = setMessage('error', 'Este es un mensaje de error.');
  console.log('Set message:', msg);
}

runTests();

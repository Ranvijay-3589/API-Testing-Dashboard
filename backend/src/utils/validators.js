const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeMethod(method) {
  return String(method || '').trim().toUpperCase();
}

function validateAuthPayload(payload, type) {
  const errors = [];

  if (type === 'register') {
    if (!payload.name || payload.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long.');
    }
  }

  if (!payload.email || !isEmail(payload.email)) {
    errors.push('A valid email is required.');
  }

  if (!payload.password || payload.password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return errors;
}

function parseJsonInput(input, fieldName) {
  if (input === undefined || input === null || input === '') {
    return null;
  }

  if (typeof input === 'object') {
    return input;
  }

  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (error) {
      throw new Error(`${fieldName} must be valid JSON.`);
    }
  }

  throw new Error(`${fieldName} must be an object or a JSON string.`);
}

function validateRequestPayload(payload) {
  const errors = [];
  const method = normalizeMethod(payload.method);

  if (!VALID_METHODS.includes(method)) {
    errors.push('Method must be one of GET, POST, PUT, DELETE.');
  }

  if (!payload.url || typeof payload.url !== 'string') {
    errors.push('URL is required.');
  } else {
    try {
      new URL(payload.url);
    } catch (error) {
      errors.push('URL must be valid.');
    }
  }

  return { errors, method };
}

module.exports = {
  VALID_METHODS,
  validateAuthPayload,
  validateRequestPayload,
  parseJsonInput
};

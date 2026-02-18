const {
  validateAuthPayload,
  validateRequestPayload,
  parseJsonInput
} = require('../src/utils/validators');

describe('validators', () => {
  test('validateAuthPayload returns errors for invalid register payload', () => {
    const errors = validateAuthPayload({ name: 'A', email: 'invalid', password: '123' }, 'register');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validateRequestPayload accepts supported method + valid URL', () => {
    const { errors, method } = validateRequestPayload({ method: 'post', url: 'https://example.com' });
    expect(errors).toEqual([]);
    expect(method).toBe('POST');
  });

  test('parseJsonInput parses JSON strings', () => {
    const parsed = parseJsonInput('{"a":1}', 'body');
    expect(parsed).toEqual({ a: 1 });
  });

  test('parseJsonInput throws for invalid json string', () => {
    expect(() => parseJsonInput('{"a"', 'body')).toThrow('body must be valid JSON.');
  });
});

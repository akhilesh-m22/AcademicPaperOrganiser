const request = require('supertest');
const app = require('../index');

describe('API basic endpoints', () => {
  test('GET /api/papers returns 200 and an array', async () => {
    const res = await request(app).get('/api/papers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/tags returns 200 and an array', async () => {
    const res = await request(app).get('/api/tags');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/authors returns 200 and an array', async () => {
    const res = await request(app).get('/api/authors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Optional integration tests for auth (will run only if RUN_INTEGRATION_TESTS=1)
if (process.env.RUN_INTEGRATION_TESTS === '1') {
  describe('Auth integration (requires DB)', () => {
    const testEmail = `test_${Date.now()}@example.com`;
    let token;

    test('POST /api/auth/register', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: testEmail, password: 'secret123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeTruthy();
    });

    test('POST /api/auth/login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'secret123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeTruthy();
      token = res.body.token;
    });
  });
}

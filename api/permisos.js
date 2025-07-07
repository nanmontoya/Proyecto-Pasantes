const request = require('supertest');
const app = require('../app'); // tu archivo principal Express

test('crear permiso devuelve 201', async () => {
  const res = await request(app)
    .post('/api/permisos')
    .send({ pasanteId: 1, fecha: '2025-07-01', horas: 2 });
  expect(res.statusCode).toBe(201);
});

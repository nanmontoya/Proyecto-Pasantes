const request = require('supertest');
const app = require('./app'); // o './server' según como se llame

describe('POST /guardar-jornada', () => {
  it('debería insertar un registro y responder con éxito', async () => {
    const response = await request(app)
      .post('/guardar-jornada')
      .send({
        usuario: 'pasante123',
        nombre: 'Juan Pérez',
        turno: 'matutino',
        horario: '8:00-14:00'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('mensaje', 'Registro insertado');
    expect(response.body).toHaveProperty('usuario', 'pasante123');
  });
});

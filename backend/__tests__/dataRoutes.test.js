const request = require('supertest');
const app = require('../index');  // Import your express app

describe('Data Routes API', () => {
  it('should fetch all data', async () => {
    const res = await request(app).get('/api/data');
        
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should generate new data', async () => {
    const res = await request(app).post('/api/data/generate');
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
  });
});


import request from 'supertest';
jest.mock('redis', () => require('redis-mock'));
beforeAll(()=>{
  jest.setTimeout(10000);
});
import app from '../src/lib/app';
// let rclient: redis.RedisClient;
const payload = {key: 'value'};

beforeAll(() => {
  // rclient = redis.createClient();
  // rclient.hset('foo:1000', 'data', '1');
  // http.createServer(app).listen(6004);
});
afterAll(() => {
  setTimeout(() => {
    jest.resetAllMocks();
    process.exit();
  }, 10000);
});

describe('default testing get requests', () => {
  test('should response with 200 on /', async () => {
    expect.assertions(2);
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
  });
  test('route read/:id', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/read/1');
    expect(response.status).toBe(200);
    // tslint:disable-next-line:no-console
    // console.log(typeof response.body);
    expect(response.body).toEqual({});
  });

});

describe('default testing post requests', () => {
  test('route patch (reponses with payload no actual write to DB)', async () => {
    expect.assertions(2);
    // const payload = {key: 'value'};
    const response = await request(app).post('/api/v1/patch/1')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payload);
  });

  test('route remove (reponses with payload no actual write to DB)', async () => {
    expect.assertions(2);
    // const payload = {key: 'value'};
    const response = await request(app).post('/api/v1/remove/1')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payload);
  });

  test('route write', async () => {
    expect.assertions(2);
    const data = {id: 'foo:321', data: [1, 2, 3]};
    const response = await request(app).post('/api/v1/write')
    .send(data)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual({success: true});
  });

});
describe('post find tests', ()=>{
  test('route find', async (done) => {
    expect.assertions(3);
    const req = {
      scan: {
        count: 1,
        pattern: 'foo:*',
      },
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(typeof response.body[0].data).toBe('object');
    expect(response.body).toEqual([{key: 'foo:321', data: {body: "[1,2,3]"}}]);
    done();
  });

  test('route missing scan values', async (done) => {
    expect.assertions(2);
    const req = {
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(422);
    expect(response).toHaveProperty('error');
    done();
  });

  test('route missing count values', async (done) => {
    expect.assertions(2);
    const req = {
      scan: {
        pattern: 'foo'
      }
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(422);
    expect(response).toHaveProperty('error');
    done();
  });
  test('route missing pattern values', async (done) => {
    expect.assertions(2);
    const req = {
      scan: {
        count: 1,
      }
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(422);
    expect(response).toHaveProperty('error');
    done();
  });
  test('route count value not a string', async (done) => {
    expect.assertions(2);
    const req = {
      scan: {
        count: {foo:'bah'},
        pattern: 'test'
      }
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(422);
    expect(response).toHaveProperty('error');
    done();
  });
  test('route count value not a string', async (done) => {
    expect.assertions(2);
    const req = {
      scan: {
        count: 1,
        pattern: {foo:'bah'}
      }
    };
    const response = await request(app).post('/api/v1/find')
    .send(req)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(422);
    expect(response).toHaveProperty('error');
    done();
  });
});

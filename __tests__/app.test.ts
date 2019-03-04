// import http from 'http';
// import redis from 'redis';
import request from 'supertest';

import app from '../src/lib/app';
// let rclient: redis.RedisClient;
const payload = {key: 'value'};

beforeAll(() => {
  // rclient = redis.createClient();
  // rclient.hset('foo:1000', 'data', '1');
  // http.createServer(app).listen(6004);
});
afterAll(() => setTimeout(() => {
  // rclient.quit();
  process.exit();
}, 5000));

describe('default testing for server', () => {
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

  test('route write', async () => {
    expect.assertions(2);
    const response = await request(app).post('/api/v1/write')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payload);
  });

  test('route patch', async () => {
    expect.assertions(2);
    // const payload = {key: 'value'};
    const response = await request(app).post('/api/v1/patch/1')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payload);
  });

  test('route remove', async () => {
    expect.assertions(2);
    // const payload = {key: 'value'};
    const response = await request(app).post('/api/v1/remove/1')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(payload);
  });

  test('route find', async () => {
    expect.assertions(2);
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
    // hard to mock the redis response for now
    // not ggod. needs some hadling of tredis setuo and so on.
    // currewntly depends on my redis db
    expect(response.body).toEqual([{data: {body: "{\"key\":\"value\"}", data: "1"}, key: "foo:1000"}]);
  });
  // it('should accept post', async () => {
  //   expect.assertions(1);
  //   const response = await request(app)
  //     .post('/submit')
  //     .send({foo: 'bah'});
  //   expect(response.status).toBe(200);
  // });
  // it('should return the passed object', async () => {
  //   expect.assertions(1);
  //   const obj = {foo: 'bah'};
  //   const response = await request(app)
  //     .post('/submit')
  //     .send(obj);
  //   expect(response.text).toEqual('{"code":0,"data":{"foo":"bah"},"errors":""}');
  // });
});

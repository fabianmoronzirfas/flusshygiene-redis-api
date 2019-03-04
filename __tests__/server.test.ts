import request from 'supertest';
import app from '../src/lib/app';

describe('default testing for server', () => {
  it('should response with 200 on /', async () => {
    expect.assertions(2);
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
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

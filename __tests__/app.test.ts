
// import request from 'supertest';
// import devlog from '../src/index';
import app from '../src/lib/app';

const mockListen = jest.fn();
app.listen = mockListen;
afterEach(() => {
  mockListen.mockReset();
});
describe('testing if the server is running', () => {
  test('server defaults', async () => {
    require('../src/index');
    // tslint:disable-next-line:no-console
    // console.log(mockListen.mock.calls[0][1]);
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(process.env.FRONTEND_REDIS_PORT || 6004);
  });
});

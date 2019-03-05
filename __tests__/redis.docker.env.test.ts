process.env.NODE_DOCKER_ENV = '1';
process.env.REDIS_HOST = 'redis';
import RDS, { rdsOptions } from '../src/lib/redis';
jest.mock('redis', () => require('redis-mock'));

afterAll(() => {
  setTimeout(() => {
    const {redisClient} = RDS.getInstances();
    redisClient.quit();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    // process.exit(0);
  }, 5000);
});

describe('testing docker env branches redis', () => {
  it('should have a redis host of name redis', () => {
    expect(rdsOptions.host).toBe(process.env.REDIS_HOST);
    // process.env.REDIS_HOST = undefined;
    // process.env.NODE_DOCKER_ENV = undefined;
  });
})

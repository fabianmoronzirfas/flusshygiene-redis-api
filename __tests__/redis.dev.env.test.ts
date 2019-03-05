process.env.NODE_DOCKER_ENV = '0';
process.env.REDIS_PORT = '6379';
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

describe('testing dev env branches redis host', ()=>{
  it('should have a redis host of name redis',()=>{
    expect(rdsOptions.host).toBe('127.0.0.1');
    // process.env.NODE_DOCKER_ENV = undefined;
  });
})

describe('testing dev env branches redis port', ()=>{
  it('should have a redis host of name redis',()=>{
    expect(rdsOptions.port).toBe('6379');
    // process.env.REDIS_PORT = undefined;
  });
})

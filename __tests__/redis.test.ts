import { retry_strategy, defaultTopics } from './../src/lib/redis';
jest.mock('redis', () => require('redis-mock'));

import RDS, { rdsOptions } from '../src/lib/redis';
const spyResult: any[] = [];
const spyOut = jest.spyOn(process.stdout, 'write');

// tslint:disable-next-line:ban-types
type stdoutFunction = (str: string, encoding?: string, cb?: Function|undefined) => boolean;
const mockFunction: stdoutFunction = (str) => {
  spyResult.push(str);
  return true;
};

spyOut.mockImplementation(mockFunction);

afterAll(() => {
  setTimeout(() => {
    const {redisClient} = RDS.getInstances();
    redisClient.quit();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    // process.exit(0);
  }, 5000);
});

describe('environment settings default development/test env', () => {
  it('node env things',  () => {
    expect(rdsOptions.host).toBe('127.0.0.1');
  });
});
describe('error handling', () => {
  it('node env things',  () => {
    const {redisClient} = RDS.getInstances();
    const spy = jest.fn();
    redisClient.on('error', spy);
    redisClient.emit('error');
    expect(spy).toHaveBeenCalled();
  });
});

describe('retry_strategy', () => {
  it('should return 1000',  () => {
    expect(retry_strategy()).toBe(1000);
    expect(typeof retry_strategy).toEqual('function');

  });
});

describe('subscribe topics', () => {
  it('if should have defaultTopics',  () => {
    expect(RDS.topics).toEqual(defaultTopics);
    RDS.getInstances(['test']);
  });
  it('if should have additionalTopics',  () => {
    RDS.getInstances(['test']);
    expect(RDS.topics).toEqual([...defaultTopics, 'test']);
  });
});

describe('testing redis singleton class', () => {
  it('should have instance of the redisClient and empty key', async (done) => {
    expect.assertions(1);
    const {redisClient} = RDS.getInstances();
    redisClient.keys('foo', (err, value) => {
      if (err) {
        throw err;
      }
      expect(value).toEqual([]);
      done();
    });
  });
  it('should have an instance of the redis Subscribe Client', (done) => {
    expect.assertions(1);
    const {subClient, redisClient} = RDS.getInstances();
    redisClient.publish('read', 'test');
    subClient.on('message', (channel) => {
      expect(channel).toBe('read');
      done();
    });
  });
});

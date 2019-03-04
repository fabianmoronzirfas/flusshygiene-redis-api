
import redis, {ClientOpts} from 'redis';
// import redisCommands from 'redis-commands';
// import util from 'util';

import logger from './utils/logger';
let nodeDevInDocker: boolean = false;

if (process.env.NODE_DOCKER_ENV === '1') {
  nodeDevInDocker = true;
  logger('we are running in a container');
} else if (process.env.NODE_DOCKER_ENV === '0') {
  logger('we are running on your machine');
  nodeDevInDocker = false;
 } else {
   logger('"process.env.NODE_DOCKER_ENV" is not defined What is your env?');
 }

const options: ClientOpts = {
  host: nodeDevInDocker === true ? process.env.REDIS_HOST : '127.0.0.1',
  port: process.env.REDIS_PORT === undefined ? 6379 : process.env.REDIS_PORT as unknown as number,
  retry_strategy: () => 1000,
};
export default class RDS {
  public static redisClient: redis.RedisClient;
  public static redisSubscribeClient: redis.RedisClient;

  public static getInstances() {
    if (!this.redisClient) {
      // this.promisify(redis.RedisClient.prototype, redisCommands.list);
      // this.promisify(redis.Multi.prototype, ['exec', 'execAtomic']);
      this.redisClient = redis.createClient(options);
      if (!this.redisSubscribeClient) {
        this.redisSubscribeClient = this.redisClient.duplicate();
      }
    }
    this.redisClient.on('connect', () => {
      logger(`redisClient connected to redis`);
  });
    this.redisClient.on('error', (err) => {
      logger(`redisClient Error: ${err}`);
  });
    this.redisSubscribeClient.on('connect', () => {
      logger(`redisSubscribeClient connected to redis`);
    });
    this.redisSubscribeClient.on('error', (err) => {
      logger(`redisSubscribeClient Error: ${err}`);
    });
    this.redisSubscribeClient.on('message', (channel, message) => {
      logger(`Redis Channel ${channel} => ${message}\n`);
    });
    this.redisSubscribeClient.subscribe('read');
    this.redisSubscribeClient.subscribe('write');
    return {
      redisClient: this.redisClient,
      subClient: this.redisSubscribeClient,
    };
  }
  // private static promisify(obj: any, methods: string[]) {
  //   methods.forEach((method: string) => {
  //     if (obj[method]) {
  //       obj[method + 'Async'] = util.promisify(obj[method]);
  //     }
  //   });
  // }
  private constructor() {}
}

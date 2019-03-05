
import redis, {ClientOpts} from 'redis';
import logger from './utils/logger';

export const defaultTopics: string[] = ['read', 'write'];
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

export const retry_strategy = () => 1000;

export const rdsOptions: ClientOpts = {
  host: nodeDevInDocker === true ? process.env.REDIS_HOST : '127.0.0.1',
  port: process.env.REDIS_PORT === undefined ? 6379 : process.env.REDIS_PORT as unknown as number,
  retry_strategy: retry_strategy,
};
export default class RDS {
  public static redisClient: redis.RedisClient;
  public static redisSubscribeClient: redis.RedisClient;
  public static topics: string[];
  public static getInstances(additionalTopics?: string[]) {
    if (!this.redisClient) {
      // this.promisify(redis.RedisClient.prototype, redisCommands.list);
      // this.promisify(redis.Multi.prototype, ['exec', 'execAtomic']);
      this.redisClient = redis.createClient(rdsOptions);
      if (!this.redisSubscribeClient) {
        this.redisSubscribeClient = this.redisClient.duplicate();
      }
      this.redisClient.on('connect', this.createConnectListener('redisClient'));
      this.redisClient.on('error', this.createErrorListener('redisClient'));
      this.redisSubscribeClient.on('error', this.createErrorListener('subClient'));
      this.redisSubscribeClient.on('connect', this.createConnectListener('subClient'));
      this.redisSubscribeClient.on('message', this.createSubListener('subClient'));
    }

    if(additionalTopics !== undefined){
      this.topics = [...defaultTopics, ...additionalTopics];
    }else{
      this.topics = [...defaultTopics];
    }
    this.topics.forEach(topic => {
      // this.redisClient.subscribe(topic);
      this.redisSubscribeClient.subscribe(topic);
    });
    return {
      redisClient: this.redisClient,
      subClient: this.redisSubscribeClient,
    };
  }
  private static createErrorListener = (name: string) => (err: Error) => {
    logger(`${name} Error: ${err}`);
  }
  private static createConnectListener = (name: string) => () => {
    logger(`${name} has connected`);
  }
  private static createSubListener = (name: string) => (channel: string, message: string) => {
    logger(`"${name}" on "${channel}" got "${message}"\n`);

  }

  private constructor() {}
}

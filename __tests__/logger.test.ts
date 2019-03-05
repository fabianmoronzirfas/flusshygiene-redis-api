import logger from '../src/lib/utils/logger';
let spyOut: any;
let spyErr: any;
beforeEach(() => {
  try {
    spyOut.mockRestore();
    spyErr.mockRestore();
  } catch (e) {
    // empty
  }
  spyOut = jest.spyOn(process.stdout, 'write');
  spyErr = jest.spyOn(process.stderr, 'write');
});
describe('logger tests for stdout', () => {
  it('should write to stdout if NODE_ENV is devlopment', () => {
    // tslint:disable-next-line:no-console
    // console.log('NODE_ENV', process.env.NODE_ENV);
    process.env.NODE_ENV = 'development';
    logger('test');
    process.env.NODE_ENV = 'test';
    expect(spyOut).toHaveBeenCalled();
    expect(spyOut).toHaveBeenCalledTimes(1);
  });
  it('should not write to stdout when NODE_ENV is not development', () => {
    logger('test');
    expect(spyOut).toHaveBeenCalledTimes(0);
  });
  it('should  write to stdout even when NODE_ENV is not development due to flag', () => {
    logger('test', true);
    expect(spyOut).toHaveBeenCalledTimes(1);
  });
});

describe('logger tests for stderr', () => {
  it('should  write to Errors to stderr when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    logger(new Error('test'));
    process.env.NODE_ENV = 'test';
    expect(spyErr).toHaveBeenCalledTimes(1);
  });
});

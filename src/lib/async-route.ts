import { Request, Response } from 'express';

// based on https://github.com/davesag/route-async
// https://itnext.io/using-async-routes-with-express-bcde8ead1de8
type Route = (req: Request, res: Response) => any;
type ErrorHandler = (error: Error) => void;

const defaultErrorHandler: ErrorHandler = (error: Error) => {
  process.stderr.write(`${error}`);
  throw error;
};

// type AsyncRoute = (req: Request, res: Response, next?: ErrorHandler) => any;

const asyncRoute = (route: Route) => (req: Request, res: Response, next: ErrorHandler = defaultErrorHandler) => {
  Promise.resolve(route(req, res)).catch(next);
};

export default asyncRoute;

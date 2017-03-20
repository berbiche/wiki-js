import { Router, Request, Response } from 'express';

const defaultRouter: Router = Router();

defaultRouter.all('*', (req: Request, res: Response) => {
    res.sendStatus(404);
});

export { defaultRouter }

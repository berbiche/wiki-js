import { Router, Request, Response } from 'express';
import * as path from 'path';

const defaultRouter: Router = Router();

defaultRouter.all('*', (req: Request, res: Response) => {
    res.redirect('/');
});

defaultRouter.all('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../src/index.html'));
});

export { defaultRouter }

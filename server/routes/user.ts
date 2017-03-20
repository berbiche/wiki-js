import { Router/*, Request, Response*/ } from 'express';

const userRouter: Router = Router();

userRouter.all('*');

export { userRouter }

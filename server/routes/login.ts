// import { Router, Request, Response } from 'express';
// import { /*randomBytes,*/ pbkdf2 }   from 'crypto';

// const loginRouter: Router = Router();
// const      config: any = process.env['npm_config_package'];
// const        salt: string = config.salt;
// const      digest: string = config.digest;
// const   iteration: number = config.iteration;
// const      length: number = config.length;

// loginRouter.post('/signup', (req: Request, res: Response) => {
//     // if ()
//     console.log(req);
//     res.send('to configure');
// });

// // To login into the service
// loginRouter.post('/', (request: Request, response: Response) => {
//     pbkdf2(request.body.password, salt, iteration, length, digest, (err: Error, hash: Buffer) => {
//         if (err) {
//             console.error(err);
//         }

//         if (hash.toString('hex') === salt) {
//             // const token = '';
//         }
//     });
// });

// export { loginRouter }

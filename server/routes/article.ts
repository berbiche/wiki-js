import { Router, Request, Response, NextFunction } from 'express';
import { format } from 'util';

const articleRouter: Router = Router();

articleRouter.route('/')
// Get all the articles
.get((req: Request, res: Response) => {
    res.send('to configure');
})
// Update an article
.post((req: Request, res: Response) => {
    log('article update');
    log(req.body);
    res.send('to configure');
});

articleRouter.route('/:title')
// Find the article, pass the object through res.locals then call next()
.all((req: Request, res: Response, next: NextFunction) => {
    log('url: %s, params: %j', req.path, req.params);
    // we need to find the article beforehand
    // TODO: implement article finding
    res.locals.article = {
        'title': 'to implement',
        'content': 'Implement the .all method',
        'last_modification': Date.now(),
        'revision': ~~(Math.random() * (100 - 1) + 1)
    };
    next();
})
// View an article
.get((req: Request, res: Response) => {
    res.send(res.locals.article);
    // res.send('to configure');
})
// Delete an article
.delete((req: Request, res: Response) => {
    res.send('to configure');
});

function log(... args: any[]): void {
    process.send(format.apply(undefined, args));
}

export { articleRouter }

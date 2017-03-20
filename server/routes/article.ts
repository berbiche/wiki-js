import { Router, Request, Response, NextFunction } from 'express';

const articleRouter: Router = Router();

// Get all the articles
articleRouter.get('/', (req: Request, res: Response) => {
    console.log(req);
    res.send('to configure');
});

articleRouter.route('/:title')
.all((req: Request, res: Response, next: NextFunction) => {
    // we need to find the article beforehand
    // TODO: implement article finding
    next();
})
// View an article
.get((req: Request, res: Response) => {
    console.log(req);
    res.send({'title': 'test', 'id': 9, 'contributor': 'test'});
    // res.send('to configure');
})
// Create or edit an article
.post((req: Request, res: Response) => {
    console.log(req);
    res.send('to configure');
})
// Delete an article
.delete((req: Request, res: Response) => {
    console.log(req);
    res.send('to configure');
});

export { articleRouter }

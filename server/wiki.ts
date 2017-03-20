import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import * as routes from './routes/routes';
const compression = require('compression');
const config = require('../config.json');

const app: express.Application = express();

app.disable('x-powered-by');
app.use(json());
app.use(compression());
app.use(urlencoded({ 'extended': true }));

// static files
app.use(express.static(path.join(__dirname, 'dist/src')));
app.use(express.static(path.join(__dirname, 'dist/lib')));

// setting up the routes that will be used by the application
// app.use('/login', routes.loginRouter);
app.use('/article', routes.articleRouter);
app.get('/', function (req: Request, res: Response) {
    res.sendFile('index.html', { 'root': '../dist/src'});
});
app.use('*', routes.defaultRouter);

const server = app.listen(config.port, () => {
    const host: string = server.address().address;
    console.log('Express server running at http://%s:%d/ in %s mode', host, config.port, app.settings.env);
});

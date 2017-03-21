import * as express         from 'express';
import { json, urlencoded } from 'body-parser';
import * as path            from 'path';
import * as routes          from './routes/routes';
import * as compression     from 'compression';
const config = require('../../config.json'); // since we are in dist/server
const __dir: string = process.cwd();

const app: express.Application = express();

app.disable('x-powered-by');
app.use(json());
app.use(compression());
app.use(urlencoded({ 'extended': true }));

// static files
app.use('/dist/src', express.static(path.join(__dir, 'dist/src'), {'index': false}));
app.use('/dist/lib', express.static(path.join(__dir, 'dist/lib'), {'index': false}));

// setting up the routes that will be used by the application
// app.use('/login', routes.loginRouter);
app.use('/article', routes.articleRouter);
// app.use('*', routes.defaultRouter);
app.use('/', function (req: Request, res: Response) {
    res.sendFile(path.resolve(__dir, 'dist/src/index.html'));
});
app.use(function (req, res) {
    res.redirect('/');
});

const server = app.listen(config.port, () => {
    // console.log('Express server running at http://%s:%d/ in %s mode',
    //     'localhost',
    //     config.port,
    //     app.settings.env);
    process.stdout.write(`Express server running at http://localhost:${config.port} in ${app.settings.env} mode`);
});
